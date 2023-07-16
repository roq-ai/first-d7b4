const mapping: Record<string, string> = {
  'flash-cards': 'flash_card',
  'learned-words': 'learned_word',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
