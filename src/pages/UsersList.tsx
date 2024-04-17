import React from 'react'

import { Card, Table, Stack, Container, TableBody, TextField, TableContainer, InputAdornment } from '@mui/material'

import { useGetUsersQuery } from 'src/lib/features/apis/usersApi';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useTable, emptyRows, TableNoData, TableEmptyRows, TableHeadCustom, TablePaginationCustom } from 'src/components/table';


const TABLE_HEAD = [
    { id: 'name', label: 'Name' },
    { id: 'phoneNumber', label: 'Phone Number', width: 180 },
    { id: 'company', label: 'Company', width: 220 },
    { id: 'role', label: 'Role', width: 180 },
    { id: 'status', label: 'Status', width: 100 },
    { id: '', width: 88 },
];


const UsersList = () => {
    const settings = useSettingsContext();
    const table = useTable();
    const { data, isSuccess } = useGetUsersQuery({ page: table.page + 1, pageSize: table.rowsPerPage })
    const notFound = isSuccess && data?.data.length === 0;
    const denseHeight = table.dense ? 56 : 56 + 20;

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
                    <TextField
                        fullWidth
                        placeholder="Search..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }} >
                            <TableHeadCustom
                                headLabel={TABLE_HEAD}
                                rowCount={data?.data.length || 0}
                            />
                            <TableBody>
                                <TableEmptyRows
                                    height={denseHeight}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, data?.data?.length || 0)}
                                />

                                <TableNoData notFound={notFound} />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>
                <TablePaginationCustom
                    count={data?.data?.length || 0}
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

export default UsersList