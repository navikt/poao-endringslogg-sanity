import { blockContent } from "./blockContent";
import {endringsloggSchema} from "./endring";
import {oversiktAlert} from "./oversiktAlert";
import {mrAdminflateEndringsloggSchema} from "./mrAdminflateEndringslogg";

export const schemas = [
  // The following are document types which will appear
  // in the studio.
  endringsloggSchema,
  oversiktAlert,
  mrAdminflateEndringsloggSchema,
  // When added to this list, object types can be used as
  // { type: 'typename' } in other document schemas
  blockContent,
];
