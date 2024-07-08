export enum EStatus {
  Complete = 1000002,
  Pending = 1000001,
}
export const EStatusTag = {
  [EStatus.Complete]: {
    text: "Đã xác nhận",
    color: "text-green-600",
    borderColor: "border-green-600",
  },
  [EStatus.Pending]: {
    text: "Chờ xác nhận",
    color: "border-blue-600",
    borderColor: "text-blue-600",
  },
};
