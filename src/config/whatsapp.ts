export type WhatsAppIntent =
  | 'general'
  | 'localGovernment'
  | 'budget'
  | 'communityInfo'
  | 'reportIssue';

const PREFILLED_MESSAGES: Record<WhatsAppIntent, string> = {
  general:
    'Hello Amoye AI, I would like to ask a question about local governance in Osun State.',
  localGovernment:
    'Hello Amoye AI, I would like information about my Local Government Area administration and leadership in Osun State.',
  budget:
    'Hello Amoye AI, I would like to understand local government budget allocations and public projects in Osun State.',
  communityInfo:
    'Hello Amoye AI, I am looking for verified civic updates and community developments in Osun State.',
  reportIssue:
    'Hello Amoye AI, I would like to share or report a civic issue affecting my community in Osun State.',
};

const envInviteUrl =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  typeof import.meta.env.VITE_WHATSAPP_COMMUNITY_INVITE_URL === 'string'
    ? import.meta.env.VITE_WHATSAPP_COMMUNITY_INVITE_URL.trim()
    : '';

export const WHATSAPP_CONFIG = {
  number: '2349162673356',
  displayNumber: '+234 916 267 3356',
  baseUrl: 'https://wa.me/2349162673356',
  /**
   * Separate, optional WhatsApp Community/Group invitation URL.
   * Deliberately kept distinct from the Amoye AI chatbot number.
   */
  communityGroupInviteUrl: envInviteUrl.startsWith('https://chat.whatsapp.com/')
    ? envInviteUrl
    : '',
  getUrl(intent: WhatsAppIntent = 'general', customMessage?: string): string {
    const message = (customMessage ?? PREFILLED_MESSAGES[intent]).trim();
    return `${this.baseUrl}?text=${encodeURIComponent(message)}`;
  },
} as const;
