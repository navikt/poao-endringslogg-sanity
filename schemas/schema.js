import { blockContent } from "./blockContent";
import {endringsloggSchema} from "./endring";
import {oversiktAlert} from "./oversiktAlert";

export const schemas = [
  // The following are document types which will appear
  // in the studio.
  endringsloggSchema,
  oversiktAlert,
  // When added to this list, object types can be used as
  // { type: 'typename' } in other document schemas
  blockContent,
];
