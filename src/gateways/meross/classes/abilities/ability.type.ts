export interface IAbilityBodies<GRequestBody extends object, GResponseBody extends object> {
  requestBody: GRequestBody;
  responseBody: GResponseBody;
}

export interface IAbility<GGet extends IAbilityBodies<any, any>, GSet extends IAbilityBodies<any, any>> {
  GET: GGet;
  SET: GSet;
}
