import {
  getProfiles,
} from "./auth-storage";

import {
  getSecuritySettings,
  saveSecuritySettings,
} from "@/features/settings/services/settings-storage";

function generateOtp(): string {
  return Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
}

export interface PinRecoveryRequest {
  accountId: string;
  profileId: string;
  recoveryEmail: string;
  otp: string;
}

export function requestOwnerPinRecovery(
  accountId: string,
): PinRecoveryRequest {
  const security =
    getSecuritySettings(accountId);

  if (!security.recoveryEmail) {
    throw new Error(
      "Owner recovery email has not been configured.",
    );
  }

  if (!security.recoveryEmailVerified) {
    throw new Error(
      "Owner recovery email is not verified.",
    );
  }

  const ownerProfile = getProfiles().find(
    (profile) =>
      profile.accountId === accountId &&
      profile.role === "OWNER" &&
      profile.active,
  );

  if (!ownerProfile) {
    throw new Error(
      "Owner profile not found.",
    );
  }

  const otp = generateOtp();

  console.log(
    `Owner PIN recovery OTP for ${security.recoveryEmail}: ${otp}`,
  );

  return {
    accountId,
    profileId: ownerProfile.id,
    recoveryEmail:
      security.recoveryEmail,
    otp,
  };
}

export function verifyOwnerPinRecoveryOtp(
  request: PinRecoveryRequest,
  enteredOtp: string,
): boolean {
  if (
    request.accountId === "" ||
    request.profileId === ""
  ) {
    return false;
  }

  return request.otp === enteredOtp;
}

export function resetOwnerPin(
  accountId: string,
  ownerProfileId: string,
  newPin: string,
): void {
  if (!/^\d{4}$/.test(newPin)) {
    throw new Error(
      "Owner PIN must be exactly 4 digits.",
    );
  }

  const profiles = getProfiles();

  const ownerProfile = profiles.find(
    (profile) =>
      profile.id === ownerProfileId &&
      profile.accountId === accountId &&
      profile.role === "OWNER" &&
      profile.active,
  );

  if (!ownerProfile) {
    throw new Error(
      "Owner profile not found.",
    );
  }

  const security =
    getSecuritySettings(accountId);

  saveSecuritySettings(
    accountId,
    {
      ...security,

      profilePins: {
        ...security.profilePins,

        [ownerProfileId]: newPin,
      },
    },
  );
}