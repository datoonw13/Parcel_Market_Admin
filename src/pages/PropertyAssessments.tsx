/* eslint-disable no-nested-ternary */
import moment from "moment";
import { useRef, useState, Fragment, useEffect } from "react";

import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import {
  Box,
  Card,
  Table,
  styled,
  Tooltip,
  TableRow,
  Container,
  TableBody,
  TableCell,
  IconButton,
  TooltipProps,
  TableContainer,
  tooltipClasses,
  Typography,
} from "@mui/material";

import { IPropertyAssessment } from "src/@types/property";
import { useGetPropertiesAssessmentsQuery } from "src/lib/features/apis/propertyApi";

import Scrollbar from "src/components/scrollbar";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs/custom-breadcrumbs";
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from "src/components/table";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

const TABLE_HEAD = [
  { id: "email", label: "Email" },
  { id: "parcelId", label: "Parcel Id" },
  { id: "propertyType", label: "Property Type" },
  { id: "acrage", label: "Acrage" },
  { id: "lastSalePrice", label: "Last Sale Price" },
  { id: "calculatedPrice", label: "Calculated price" },
  { id: "pricePerAcrage", label: "Price per acrage" },
  { id: "lastSaleDate", label: "Last Sale Date" },
  { id: "searchDateTime", label: "Search date/time" },
  { id: "state", label: "State/County" },
  { id: "opt", label: "" },
];

const GetBg = (currentEl: IPropertyAssessment["assessments"][0]) => {
  if (!currentEl.isValid) {
    return "rgba(245, 0, 0, 0.5)";
  }
  if (currentEl.isMedianValid) {
    return "rgba(0, 255, 0, 0.5)";
  }

  return "yellow";
};

const PropertyAssessments = () => {
  const ref = useRef<ReturnType<typeof setTimeout>>();
  const settings = useSettingsContext();
  const table = useTable();
  const { data, isSuccess } = useGetPropertiesAssessmentsQuery({
    page: table.page + 1,
    pageSize: table.rowsPerPage,
    search: null,
  });
  const notFound = isSuccess && data?.data.properties.length === 0;
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const handleCollapse = (id: number) => {
    setOpenItemId(id === openItemId ? null : id);
  };

  useEffect(
    () => () => {
      if (ref.current) {
        window.clearTimeout(ref.current);
      }
    },
    []
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <CustomBreadcrumbs
        heading="Properties Assessments"
        links={[]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card>
        <TableContainer sx={{ position: "relative", overflow: "unset" }}>
          <Scrollbar>
            <Table
              size={table.dense ? "small" : "medium"}
              sx={{ minWidth: 960 }}
            >
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                rowCount={data?.data.properties.length || 0}
              />
              <TableBody>
                {data?.data.properties?.map((el) => (
                  <Fragment key={el.id}>
                    <TableRow
                      onClick={() => handleCollapse(el.id)}
                      hover
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{el?.user?.email}</TableCell>
                      <TableCell>{el.parcelNumber}</TableCell>
                      <TableCell>{el?.propertyType || "-"}</TableCell>
                      <TableCell>{el?.acrage || "-"}</TableCell>
                      <TableCell size="small">
                        {el?.lastSalesPrice
                          ? formatter.format(el.lastSalesPrice)
                          : "-"}
                      </TableCell>
                      <CustomWidthTooltip
                        PopperProps={{ sx: { width: 500 } }}
                        sx={{ width: " 500px" }}
                        title={
                          <Box>
                            <Typography>
                              Median:{" "}
                              <b style={{ marginLeft: 10 }}>
                                {formatter.format(Number(el.median))}
                              </b>
                            </Typography>
                            <Typography>
                              Median Lower Bound:{" "}
                              <b style={{ marginLeft: 10 }}>
                                {formatter.format(Number(el.medianLowerBound))}
                              </b>
                            </Typography>
                            <Typography>
                              Median Upper Bound:{" "}
                              <b style={{ marginLeft: 10 }}>
                                {formatter.format(Number(el.medianUpperBound))}
                              </b>
                            </Typography>
                            <Typography>
                              Average Price Per Acre Of Valid Medians:{" "}
                              <b style={{ marginLeft: 10 }}>
                                {formatter.format(
                                  Number(el.averagePricePerAcreValidMedians)
                                )}
                              </b>
                            </Typography>
                          </Box>
                        }
                      >
                        <TableCell>
                          {formatter.format(Number(el.price))}
                        </TableCell>
                      </CustomWidthTooltip>
                      <CustomWidthTooltip
                        PopperProps={{ sx: { width: 500 } }}
                        sx={{ width: " 500px" }}
                        title={
                          <Box>
                            <Typography>
                              Median:{" "}
                              <b style={{ marginLeft: 10 }}>
                                {formatter.format(Number(el.median))}
                              </b>
                            </Typography>
                            <Typography>
                              Median Lower Bound:{" "}
                              <b style={{ marginLeft: 10 }}>
                                {formatter.format(Number(el.medianLowerBound))}
                              </b>
                            </Typography>
                            <Typography>
                              Median Upper Bound:{" "}
                              <b style={{ marginLeft: 10 }}>
                                {formatter.format(Number(el.medianUpperBound))}
                              </b>
                            </Typography>
                            <Typography>
                              Average Price Per Acre Of Valid Medians:{" "}
                              <b style={{ marginLeft: 10 }}>
                                {formatter.format(
                                  Number(el.averagePricePerAcreValidMedians)
                                )}
                              </b>
                            </Typography>
                          </Box>
                        }
                      >
                        <TableCell size="small">
                          {formatter.format(Number(el.price) / el.acrage)}
                        </TableCell>
                      </CustomWidthTooltip>
                      <TableCell size="small">
                        {el?.lastSalesDate
                          ? moment(el.lastSalesDate).format("MM-DD-YYYY")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {moment(el.dateCreated).format("MM-DD-YYYY hh:mm A")}
                      </TableCell>
                      <TableCell>{`${el?.state}/${el?.county}`}</TableCell>
                      <TableCell>
                        <IconButton>
                          {openItemId === el.id ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    {openItemId === el.id &&
                      el.assessments.map((assessment) => (
                        <TableRow
                          key={assessment.id}
                          sx={() => ({ bgcolor: GetBg(assessment) })}
                        >
                          <TableCell size="small" sx={{ pl: 6 }}>
                            {assessment.owner}
                          </TableCell>
                          <TableCell size="small">
                            {assessment.parselId}
                          </TableCell>
                          <TableCell size="small">
                            {assessment.propertyType}{" "}
                          </TableCell>
                          <TableCell size="small">
                            {assessment.acrage}
                          </TableCell>
                          <TableCell size="small">
                            {formatter.format(assessment.lastSalesPrice)}
                          </TableCell>
                          <TableCell size="small">-</TableCell>
                          <TableCell size="small">
                            {formatter.format(
                              assessment.lastSalesPrice /
                                Number(assessment.acrage)
                            )}
                          </TableCell>
                          <TableCell size="small">
                            {assessment.lastSalesDate
                              ? moment(assessment.lastSalesDate).format(
                                  "MM-DD-YYYY"
                                )
                              : "-"}
                          </TableCell>
                          <TableCell size="small">
                            {moment(el.dateCreated).format(
                              "MM-DD-YYYY hh:mm A"
                            )}
                          </TableCell>
                          <TableCell size="small">- </TableCell>
                          <TableCell />
                        </TableRow>
                      ))}
                  </Fragment>
                ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={data?.data?.pagination.totalCount || 0}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
};

export default PropertyAssessments;
