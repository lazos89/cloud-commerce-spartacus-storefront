import { AnonymousConsentsConfig } from './anonymous-consents-config';

export const defaultAnonymousConsentsConfig: AnonymousConsentsConfig = {
  anonymousConsents: {
    footerLink: true,
    registerConsent: 'MARKETING_NEWSLETTER',
    showLegalDescriptionInDialog: true,
    requiredConsents: [],
    consentManagementPage: {
      showAnonymousConsents: true,
      hideConsents: [],
    },
  },
};