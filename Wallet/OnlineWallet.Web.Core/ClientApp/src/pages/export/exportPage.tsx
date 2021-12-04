import { dateFormatNew } from "../../services/helpers";
import { importExportService } from "../../services/walletApi";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useCallback, useMemo } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { RangeSelector } from "./components/RangeSelector";
import { YearMonthSelector } from "./components/YearMonthSelector";
import { ExportPageState, getRangeSelection, rangeTypes } from "./services";

export interface ExportPageProps {}

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
