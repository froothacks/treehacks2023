export enum BaseRoute {
  HOME = "/",
  CREATE_ACCOUNT = "/account",
  WORKSHEETS = "/worksheets",
  SUBMISSIONS = "/submissions",
  NOT_FOUND = "/404",
}

export enum QueryParams {
  WORKSHEET_ID = "ws_id",
  SUBMISSION_ID = "sub_id",
}

export const RouteName = {
  HOME: BaseRoute.HOME as const,
  CREATE_ACCOUNT: BaseRoute.CREATE_ACCOUNT as const,
  WORKSHEETS: BaseRoute.WORKSHEETS as const,
  WORKSHEET: `${BaseRoute.WORKSHEETS}/:${QueryParams.WORKSHEET_ID}` as const,
  SUBMISSION: `${BaseRoute.SUBMISSIONS}/:${QueryParams.SUBMISSION_ID}` as const,
  NOT_FOUND: BaseRoute.NOT_FOUND as const,
};
