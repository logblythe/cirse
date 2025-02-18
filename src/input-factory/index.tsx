import { ControlledCombobox } from "@/components/ControlledCombobox";
import { ControlledMultiSelect } from "@/components/ControlledMultiSelect";
import { QuestionType } from "@/type/question-type";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  items: { id: string; name: string }[];
  onChange?: (value: string | string[]) => void;
  type?: QuestionType;
  isLoading?: boolean;
};

const InputFactory = (props: Props) => {
  const { type, ...rest } = props;

  if (type === "checkboxList") {
    return <ControlledMultiSelect {...rest} />;
  }

  return <ControlledCombobox {...rest} />;

  // const inputMapper: { [key in Partial<QuestionType>]: React.ReactElement } = {
  //   jwtToken: <>jwtToken</>,
  //   donation: <>donation</>,
  //   heading: <>heading</>,
  //   textInput: <ControlledInput name={name} />,
  //   phone: <ControlledInput type="number" name={name} />,
  //   email: <ControlledInput type="email" name={name} />,
  //   emailDomain: <ControlledInput type="email" name={name} />,
  //   textArea: <ControlledTextArea name={name} />,
  //   dropDownList: <ControlledSelect items={choices} name={name} />,
  //   radioList: <ControlledRadio items={choices} name={name} />,
  //   checkboxList: <ControlledCheckbox items={choices} name={name} />,
  //   date: <Calendar mode="single" className="rounded-md border" />,
  // };

  // return inputMapper[type] ?? <div>No input type </div>;
};

export default InputFactory;
