
import { ParsedUrlQuery } from "querystring"

export interface Params extends ParsedUrlQuery {
  topic?: string;
  post?: string;
  category?: string;
}