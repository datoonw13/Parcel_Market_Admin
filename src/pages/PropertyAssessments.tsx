/* eslint-disable no-nested-ternary */
import moment from 'moment';
import React, { useRef, useState, Fragment, useEffect } from 'react'

import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material'
import { Box, Card, Table, Stack, styled, Tooltip, TableRow, Container, TableBody, TableCell, IconButton, Typography, TooltipProps, TableContainer, tooltipClasses } from '@mui/material'

import { IPropertyAssessment } from 'src/@types/property';
import { useGetPropertiesAssessmentsQuery } from 'src/lib/features/apis/propertyApi';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useTable, TableNoData, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });


const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
    },
});

const TABLE_HEAD = [
    { id: 'owner', label: 'Owner' },
    { id: 'parcelId', label: 'Parcel Id' },
    { id: 'propertyType', label: 'Property Type' },
    { id: 'acrage', label: 'Acrage' },
    { id: 'calculatedPrice', label: 'Calculated price' },
    { id: 'lastSalePrice', label: 'Last Sale Price' },
    { id: 'pricePerAcrage', label: 'Price per acrage' },
    { id: 'lastSaleDate', label: 'Last Sale Date' },
    { id: 'searchDateTime', label: 'Search date/time' },
    { id: 'state', label: 'State/County' },
    { id: 'opt', label: '' },
];


const GetBg = (item: IPropertyAssessment, currentEl: IPropertyAssessment['assessments'][0]) => {
    if (!currentEl.isValid) {
        return 'rgba(245, 0, 0, 0.5)';
    }
    if (currentEl.frontEndCalculateIsValidMedian) {
        return 'rgba(0, 255, 0, 0.5)';
    }

    return 'yellow';
}

const PropertyAssessments = () => {
    const ref = useRef<ReturnType<typeof setTimeout>>()
    const settings = useSettingsContext();
    // const [search, setSearch] = useState<string | null>(null)
    const table = useTable();
    const { data, isSuccess } = useGetPropertiesAssessmentsQuery({ page: table.page + 1, pageSize: table.rowsPerPage, search: null })
    const notFound = isSuccess && data?.data.properties.length === 0;
    const [openItemId, setOpenItemId] = useState<number | null>(null)

    // const handleSearch = (value: string) => {
    //     if (ref.current) {
    //         window.clearTimeout(ref.current)
    //     }
    //     ref.current = setTimeout(() => {
    //         setSearch(value || null)
    //     }, 300)
    // }


    const handleCollapse = (id: number) => {
        setOpenItemId(id === openItemId ? null : id)
    }

    useEffect(() => () => {
        if (ref.current) {
            window.clearTimeout(ref.current)
        }
    }, [])

    const sortData = (x: IPropertyAssessment['assessments']) => x.sort((a, b) => (Number(a.lastSalesPrice) / Number(a.acrage)) - (Number(b.lastSalesPrice) / Number(b.acrage)))

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Properties Assessments"
                links={[]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            <Card>
                <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1, p: 2 }}>
                    {/* <TextField
                        fullWidth
                        placeholder="Search by name or email"
                        onChange={e => handleSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                     lastSalesPrice       ),
                        }}
                    /> */}
                </Stack>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }} >
                            <TableHeadCustom
                                headLabel={TABLE_HEAD}
                                rowCount={data?.data.properties.length || 0}
                            />
                            <TableBody>
                                {data?.data.properties.map(el =>
                                    <Fragment key={el.id} >
                                        <TableRow onClick={() => handleCollapse(el.id)} hover sx={{ cursor: "pointer" }}>
                                            <TableCell>{el.name_owner}</TableCell>
                                            <TableCell>{el.parcelNumber}</TableCell>
                                            <TableCell>{el?.propertyType || '-'}</TableCell>
                                            <TableCell>{el?.acrage || '-'}</TableCell>
                                            <TableCell>{formatter.format(el.frontEndCalculatesPrice)}</TableCell>
                                            <TableCell size='small'>{el?.lastSalesPrice ? formatter.format(el.lastSalesPrice) : '-'}</TableCell>
                                            <TableCell size='small'>{formatter.format(el.frontEndCalculatesPricePerAcre)}</TableCell>
                                            <TableCell size='small'>{el?.lastSalesDate ? moment(el.lastSalesDate).format('MM-DD-YYYY') : '-'}</TableCell>
                                            <TableCell>{moment(el.dateCreated).format('MM-DD-YYYY hh:mm A')}</TableCell>
                                            <TableCell>{`${el?.state}/${el?.county}`}</TableCell>
                                            <TableCell><IconButton >{openItemId === el.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</IconButton></TableCell>
                                        </TableRow>
                                        {openItemId === el.id && sortData([...el.assessments]).map(assessment =>
                                            <CustomWidthTooltip PopperProps={{ sx: { width: 500 } }} sx={{ width: ' 500px' }} title={
                                                <Box>
                                                    <Typography>Median: <b style={{ marginLeft: 10 }}>{el.frontEndCalculatesMedian}</b></Typography>
                                                    <Typography>Median / 2 : <b style={{ marginLeft: 10 }}>{el.frontEndCalculatesLowerMedian}</b></Typography>
                                                    <Typography>Median * 5: <b style={{ marginLeft: 10 }}>{el.frontEndCalculatesUpperMedian}</b></Typography>
                                                    <Typography>{`Median / 2 < CurrentItemLastSalePrice < Median * 5`} : <b style={{ marginLeft: 10, }}>{assessment.frontEndCalculateIsValidMedian.toString()}</b></Typography>
                                                </Box>
                                            }>
                                                <TableRow key={assessment.id} sx={() => ({ bgcolor: GetBg(el, assessment) })}>
                                                    <TableCell size='small' sx={{ pl: 6 }}>{assessment.owner}</TableCell>
                                                    <TableCell size='small'>{assessment.parselId}</TableCell>
                                                    <TableCell size='small'>{assessment.propertyType} </TableCell>
                                                    <TableCell size='small'>{assessment.acrage}</TableCell>
                                                    <TableCell size='small'>-</TableCell>
                                                    <TableCell size='small'>{formatter.format(assessment.lastSalesPrice)}</TableCell>
                                                    <TableCell size='small'>{formatter.format(assessment.lastSalesPrice / Number(assessment.acrage))}</TableCell>
                                                    <TableCell size='small'>{assessment.lastSalesDate ? moment(assessment.lastSalesDate).format('MM-DD-YYYY') : '-'}</TableCell>
                                                    <TableCell size='small'>{moment(el.dateCreated).format('MM-DD-YYYY hh:mm A')}</TableCell>
                                                    <TableCell size='small'>- </TableCell>
                                                    <TableCell />
                                                </TableRow>
                                            </CustomWidthTooltip>
                                        )}
                                    </Fragment>
                                )}

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
    )
}

export default PropertyAssessments
