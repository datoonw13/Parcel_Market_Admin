import moment from 'moment';
import React, { useRef, useState, Fragment, useEffect } from 'react'

import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material'
import { Card, Table, Stack, TableRow, Container, TableBody, TableCell, IconButton, TableContainer } from '@mui/material'

import { useGetPropertiesAssessmentsQuery } from 'src/lib/features/apis/propertyApi';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useTable, TableNoData, TableHeadCustom, TablePaginationCustom } from 'src/components/table';


const TABLE_HEAD = [
    { id: 'owner', label: 'Owner' },
    { id: 'parcelId', label: 'Parcel Id' },
    { id: 'propertyType', label: 'Property Type' },
    { id: 'acrage', label: 'Acrage' },
    { id: 'marketPrice', label: 'Market Price' },
    { id: 'lastSalePrice', label: 'Last Sale Price' },
    { id: 'lastSaleDate', label: 'Last Sale Date' },
    { id: 'searchDateTime', label: 'Search date/time' },
    { id: 'opt', label: '' },
];


const PropertyAssessments = () => {
    const ref = useRef<ReturnType<typeof setTimeout>>()
    const settings = useSettingsContext();
    const [search, setSearch] = useState<string | null>(null)
    const table = useTable();
    const { data, isSuccess } = useGetPropertiesAssessmentsQuery({ page: table.page + 1, pageSize: table.rowsPerPage, search })
    const notFound = isSuccess && data?.data.properties.length === 0;
    const [openItemId, setOpenItemId] = useState<number | null>(null)

    const handleSearch = (value: string) => {
        if (ref.current) {
            window.clearTimeout(ref.current)
        }
        ref.current = setTimeout(() => {
            setSearch(value || null)
        }, 300)
    }


    const handleCollapse = (id: number) => {
        setOpenItemId(id === openItemId ? null : id)
    }

    useEffect(() => () => {
        if (ref.current) {
            window.clearTimeout(ref.current)
        }
    }, [])


    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Users"
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
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
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
                                            <TableCell>Property Type </TableCell>
                                            <TableCell>arcage</TableCell>
                                            <TableCell>{el.price}</TableCell>
                                            <TableCell>last sale price</TableCell>
                                            <TableCell>last sale date</TableCell>
                                            <TableCell>{moment(el.dateCreated).format('MM-DD/YY hh:mm A')}</TableCell>
                                            <TableCell><IconButton >{openItemId === el.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</IconButton></TableCell>
                                        </TableRow>
                                        {openItemId === el.id && el.assessments.map(assessment =>
                                            <TableRow key={assessment.id} sx={theme => ({ bgcolor: assessment.isValid ? theme.palette.success.light : theme.palette.error.light })}>
                                                <TableCell size='small' sx={{ pl: 6 }}>{assessment.owner}</TableCell>
                                                <TableCell size='small'>{assessment.parselId}</TableCell>
                                                <TableCell size='small'>{assessment.propertyType} </TableCell>
                                                <TableCell size='small'>{assessment.arcage}</TableCell>
                                                <TableCell size='small'>{assessment.price}</TableCell>
                                                <TableCell size='small'>{assessment.lastSalesPrice}</TableCell>
                                                <TableCell size='small'>{assessment.lastSalesDate ? moment(assessment.lastSalesDate).format('MM-DD/YY hh:mm A') : '-'}</TableCell>
                                                <TableCell size='small'>{moment(el.dateCreated).format('MM-DD/YY hh:mm A')}</TableCell>
                                                <TableCell />
                                            </TableRow>
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