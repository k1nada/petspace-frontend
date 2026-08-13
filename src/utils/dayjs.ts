import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pl";
import "dayjs/locale/en";

dayjs.extend(relativeTime);

export default dayjs;
export type { Dayjs } from "dayjs";
