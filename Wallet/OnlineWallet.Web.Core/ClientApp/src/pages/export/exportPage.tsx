import { dateFormat, dateFormatNew } from "../../helpers";
import { importExportService } from "../../walletApi";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { useCallback, useMemo } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";

export interface ExportPageProps {}

export interface ExportPageState {
  rangeType: string;
  rangeFrom: string;
  rangeTo: string;
  file: string;
  year: string;
  month: string;
}
const rangeTypes = [
  {
    value: "1",
    name: "Year/Month",
  },
  {
    value: "2",
    name: "From-To",
  },
];

function getRangeSelection(state: ExportPageState) {
  const { rangeFrom, rangeTo, rangeType, month, year } = state;
  if (rangeType === "1") {
    const from = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return {
      rangeFrom: format(from, dateFormat),
      rangeTo: format(endOfMonth(from), dateFormat),
    };
  }
  return { rangeFrom, rangeTo };
}

export function ExportPage() {
  const now = useMemo(() => new Date(), []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExportPageState>({
    shouldUnregister: true,
    defaultValues: {
      rangeType: "1",
      file: "Export",
      month: (now.getMonth() + 1).toString(),
      year: now.getFullYear().toString(),
      rangeFrom: format(startOfMonth(now), dateFormatNew),
      rangeTo: format(endOfMonth(now), dateFormatNew),
    },
  });
  const rangeType = watch("rangeType");

  const onSubmit = useCallback((data: ExportPageState) => {
    const { file } = data;
    const { rangeFrom, rangeTo } = getRangeSelection(data);
    importExportService.exportRange(rangeFrom, rangeTo, file);
  }, []);
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group as={Row} className="mb-3" controlId="file">
        <Form.Label column sm="2">
          Export file
        </Form.Label>
        <Col>
          <Form.Control {...register("file", { required: true })} isInvalid={!!errors.file} />
          <Form.Control.Feedback type="invalid">Field required.</Form.Control.Feedback>
        </Col>
        <Col sm="auto">
          <Button type="submit" variant="primary">
            Download
          </Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="rangeType">
        <Form.Label column sm="2">
          Range type
        </Form.Label>
        <Col>
          <Form.Select {...register("rangeType")}>
            {rangeTypes.map((v) => (
              <option key={v.value} value={v.value}>
                {v.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>
      <Card>
        {rangeType === "1" && <YearMonthSelector register={register} errors={errors} />}
        {rangeType === "2" && <RangeSelector register={register} errors={errors} />}
      </Card>
    </Form>
  );
}
interface YearMonthSelectorProps {
  register: UseFormRegister<ExportPageState>;
  errors: FieldErrors<ExportPageState>;
}
function YearMonthSelector({ register, errors }: YearMonthSelectorProps) {
  return (
    <Card.Body>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Year/Month
        </Form.Label>
        <Col>
          <Form.Control type="number" {...register("year", { required: true })} isInvalid={!!errors.year} />
          <Form.Control.Feedback type="invalid">Field required.</Form.Control.Feedback>
        </Col>
        <Col>
          <Form.Control type="number" {...register("month", { required: true })} isInvalid={!!errors.month} />
          <Form.Control.Feedback type="invalid">Field required.</Form.Control.Feedback>
        </Col>
      </Form.Group>
    </Card.Body>
  );
}

interface RangeProps {
  register: UseFormRegister<ExportPageState>;
  errors: FieldErrors<ExportPageState>;
}

function RangeSelector({ register, errors }: RangeProps) {
  return (
    <Card.Body>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="1">
          From
        </Form.Label>
        <Col>
          <Form.Control type="date" {...register("rangeFrom", { required: true })} isInvalid={!!errors.rangeFrom} />
          <Form.Control.Feedback type="invalid">Field required.</Form.Control.Feedback>
        </Col>
        <Form.Label column sm="1">
          To
        </Form.Label>
        <Col>
          <Form.Control type="date" {...register("rangeTo", { required: true })} isInvalid={!!errors.rangeTo} />
          <Form.Control.Feedback type="invalid">Field required.</Form.Control.Feedback>
        </Col>
      </Form.Group>
    </Card.Body>
  );
}
