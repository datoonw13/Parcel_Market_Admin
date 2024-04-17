import React from 'react'

import { Table, Container, TableContainer } from '@mui/material'

import { useGetUsersQuery } from 'src/lib/features/apis/usersApi';

import { useTable } from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

const UsersList = () => {
    const settings = useSettingsContext();
    const table = useTable();
    const { data } = useGetUsersQuery()

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Users"
                links={[]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Scrollbar>
                    <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }} />
                </Scrollbar>
            </TableContainer>
        </Container>
    )
}

export default UsersList