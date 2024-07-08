import { EStatus, EStatusTag } from "./StatusTag.model";

interface IStatusTag {
  value: EStatus;
}

const StatusTag = ({ value }: IStatusTag) => {
  const result = EStatusTag[value];
  if (!value) return <>N/A</>;
  if (!result) return <>2</>;
  else {
    const { text, color, borderColor } = result ?? {};
    return (
      <div
        className={`${color}
          ${borderColor}
          border-2
          border-solid
          pt-1
          pl-3
          pr-3
          pb-1`}
        style={{ padding: "3px 10px 3px 10px", width: "max-content" }}>
        {text}
      </div>
    );
  }
};

export default StatusTag;
