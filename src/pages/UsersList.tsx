import React, { useRef, useState, useEffect } from 'react'

import { Card, Table, Stack, TableRow, Container, TableBody, TextField, TableCell, TableContainer, InputAdornment } from '@mui/material'

import { useGetUsersQuery } from 'src/lib/features/apis/usersApi';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useTable, TableNoData, TableHeadCustom, TablePaginationCustom } from 'src/components/table';


const TABLE_HEAD = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'role', width: 180 },
    { id: 'county', label: 'county', width: 220 },
    { id: 'state', label: 'state', width: 180 },
    { id: 'mailingAddress', label: 'mailingAddress', width: 100 },
];


const UsersList = () => {
    const ref = useRef<ReturnType<typeof setTimeout>>()
    const settings = useSettingsContext();
    const [search, setSearch] = useState<string | null>(null)
    const table = useTable();
    const { data, isSuccess } = useGetUsersQuery({ page: table.page + 1, pageSize: table.rowsPerPage, search })
    const notFound = isSuccess && data?.data.users.length === 0;

    const handleSearch = (value: string) => {
        if (ref.current) {
            window.clearTimeout(ref.current)
        }
        ref.current = setTimeout(() => {
            setSearch(value || null)
        }, 300)
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
                    <TextField
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
                    />
                </Stack>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }} >
                            <TableHeadCustom
                                headLabel={TABLE_HEAD}
                                rowCount={data?.data.users.length || 0}
                            />
                            <TableBody>
                                {data?.data.users.map(el => <TableRow hover key={el.id}>
                                    <TableCell>{`${el.firstName} ${el.lastName}`}</TableCell>
                                    <TableCell>{el.email}</TableCell>
                                    <TableCell>{el.role}</TableCell>
                                    <TableCell>{el.county}</TableCell>
                                    <TableCell>{el.state}</TableCell>
                                    <TableCell>{el.mailingAddress}</TableCell>
                                </TableRow>)}
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

export default UsersList