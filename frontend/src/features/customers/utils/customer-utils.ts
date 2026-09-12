import type {
  EstimateStatus,
  EstimateType,
  SavedCustomEstimate,
  SavedEstimate,
  SavedRoundSizeEstimate,
} from "@/features/estimate/types";

import {
  getSavedEstimates,
  getSavedRoundEstimates,
  getSavedCustomEstimates,
} from "@/features/estimate/services/estimate-storage";

import { getProfiles } from "@/features/auth/auth-storage";

import type {
  CustomerEstimate,
  CustomerSummary,
} from "../types";

type AnySavedEstimate =
  | SavedEstimate
  | SavedRoundSizeEstimate
  | SavedCustomEstimate;

export function normalizePhoneNumber(
  phone: string,
): string {
    const digits = phone.replace(/\D/g, "");

    // Normalize Indian numbers so:
    // +91 98765 43210
    // 91 98765 43210
    // 09876543210
    // 9876543210
    // can represent the same customer.
    if (digits.length === 12 && digits.startsWith("91")) {
      return digits.slice(2);
    }

    if (digits.length === 11 && digits.startsWith("0")) {
      return digits.slice(1);
    }

    return digits;
  }

/**
 * Converts an estimate into the common structure
 * used by the Customers feature.
 */
function mapEstimate(
  estimate: AnySavedEstimate,
  profileName: string,
): CustomerEstimate {
  return {
    id: estimate.id,
    estimateNumber: estimate.estimateNumber,
    type: estimate.type as EstimateType,
    status: estimate.status as EstimateStatus,

    date: estimate.date,
    createdAt: estimate.createdAt,

    partyName: estimate.partyName,
    contactNumber: estimate.contactNumber,
    reference: estimate.reference,

    profileId: estimate.createdBy,
    profileName,

    grandTotal: estimate.totals.grandTotal,
    advancePaid: estimate.totals.advancePaid,
    balanceDue: estimate.totals.balanceDue,
  };
}

/**
 * Returns all estimates belonging to an account,
 * regardless of estimate type.
 */
export function getAllCustomerEstimates(
  accountId: string,
): CustomerEstimate[] {
  const profiles = getProfiles().filter(
    (profile) =>
      profile.accountId === accountId &&
      profile.active,
  );

  const profileMap = new Map(
    profiles.map((profile) => [
      profile.id,
      profile.name,
    ]),
  );

  const cutEstimates =
    getSavedEstimates(accountId);

  const roundEstimates =
    getSavedRoundEstimates(accountId);

  const customEstimates =
    getSavedCustomEstimates(accountId);

  const allEstimates: CustomerEstimate[] = [
    ...cutEstimates.map((estimate) =>
      mapEstimate(
        estimate,
        profileMap.get(estimate.createdBy) ??
          "Unknown Profile",
      ),
    ),

    ...roundEstimates.map((estimate) =>
      mapEstimate(
        estimate,
        profileMap.get(estimate.createdBy) ??
          "Unknown Profile",
      ),
    ),

    ...customEstimates.map((estimate) =>
      mapEstimate(
        estimate,
        profileMap.get(estimate.createdBy) ??
          "Unknown Profile",
      ),
    ),
  ];

  return allEstimates.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  );
}

/* -------------------------------------------------------------------------- */
/* Customer Grouping                                                          */
/* -------------------------------------------------------------------------- */

export function getCustomerSummaries(
  accountId: string,
): CustomerSummary[] {
  const estimates =
    getAllCustomerEstimates(accountId);

  const customerMap =
    new Map<string, CustomerEstimate[]>();

  for (const estimate of estimates) {
    const phone =
      normalizePhoneNumber(
        estimate.contactNumber,
      );

    if (!phone) {
      continue;
    }

    const existing =
      customerMap.get(phone) ?? [];

    existing.push(estimate);

    customerMap.set(
      phone,
      existing,
    );
  }

  const customers: CustomerSummary[] = [];

  for (const [
    phone,
    customerEstimates,
  ] of customerMap.entries()) {
    const sortedEstimates =
      [...customerEstimates].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );

    const latest =
      sortedEstimates[0];

    const confirmedEstimates =
      sortedEstimates.filter(
        (estimate) =>
          estimate.status === "CONFIRMED",
      );

    customers.push({
      phone,
      name: latest.partyName,
      reference: latest.reference,

      totalEstimates:
        sortedEstimates.length,

      totalSales:
        confirmedEstimates.reduce(
          (sum, estimate) =>
            sum + estimate.grandTotal,
          0,
        ),

      totalAdvancePaid:
        confirmedEstimates.reduce(
          (sum, estimate) =>
            sum + estimate.advancePaid,
          0,
        ),

      totalBalanceDue:
        confirmedEstimates.reduce(
          (sum, estimate) =>
            sum + estimate.balanceDue,
          0,
        ),

      estimates: sortedEstimates,
    });
  }

  return customers.sort(
    (a, b) =>
      new Date(
        b.estimates[0]?.createdAt ?? 0,
      ).getTime() -
      new Date(
        a.estimates[0]?.createdAt ?? 0,
      ).getTime(),
  );
}

/* -------------------------------------------------------------------------- */
/* Profile Grouping                                                           */
/* -------------------------------------------------------------------------- */

export interface ProfileEstimateSummary {
  profileId: string;
  profileName: string;

  totalEstimates: number;

  cutSizeCount: number;
  roundSizeCount: number;
  customCount: number;

  totalSales: number;
  totalAdvancePaid: number;
  totalBalanceDue: number;

  estimates: CustomerEstimate[];
}

export function getProfileEstimateSummaries(
  accountId: string,
): ProfileEstimateSummary[] {
  const estimates =
    getAllCustomerEstimates(accountId);

  const profileMap =
    new Map<string, CustomerEstimate[]>();

  for (const estimate of estimates) {
    const existing =
      profileMap.get(
        estimate.profileId,
      ) ?? [];

    existing.push(estimate);

    profileMap.set(
      estimate.profileId,
      existing,
    );
  }

  return Array.from(
    profileMap.entries(),
  )
    .map(
      ([
        profileId,
        profileEstimates,
      ]) => {
        const confirmed =
          profileEstimates.filter(
            (estimate) =>
              estimate.status ===
              "CONFIRMED",
          );

        return {
          profileId,

          profileName:
            profileEstimates[0]
              ?.profileId ??
            "Unknown Profile",

          totalEstimates:
            profileEstimates.length,

          cutSizeCount:
            profileEstimates.filter(
              (estimate) =>
                estimate.type ===
                "CUT_SIZE",
            ).length,

          roundSizeCount:
            profileEstimates.filter(
              (estimate) =>
                estimate.type ===
                "ROUND_SIZE",
            ).length,

          customCount:
            profileEstimates.filter(
              (estimate) =>
                estimate.type ===
                "CUSTOM",
            ).length,

          totalSales:
            confirmed.reduce(
              (sum, estimate) =>
                sum + estimate.grandTotal,
              0,
            ),

          totalAdvancePaid:
            confirmed.reduce(
              (sum, estimate) =>
                sum + estimate.advancePaid,
              0,
            ),

          totalBalanceDue:
            confirmed.reduce(
              (sum, estimate) =>
                sum + estimate.balanceDue,
              0,
            ),

          estimates:
            [...profileEstimates].sort(
              (a, b) =>
                new Date(
                  b.createdAt,
                ).getTime() -
                new Date(
                  a.createdAt,
                ).getTime(),
            ),
        };
      },
    )
    .sort(
      (a, b) =>
        b.totalEstimates -
        a.totalEstimates,
    );
}