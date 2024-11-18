import moment from "moment";
import React, { useRef, useState, useEffect } from "react";

import { LoadingButton } from "@mui/lab";
import { MoreVert } from "@mui/icons-material";
import {
  Card,
  Menu,
  Table,
  Stack,
  Dialog,
  Button,
  TableRow,
  MenuItem,
  Container,
  TableBody,
  TextField,
  TableCell,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  InputAdornment,
} from "@mui/material";

import SnackbarUtils from 'src/utils/snackbar'

import {
  useGetUsersQuery,
  useActivateFreeTrialMutation,
} from "src/lib/features/apis/usersApi";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs/custom-breadcrumbs";
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from "src/components/table";

const TABLE_HEAD = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "Source", label: "Source" },
  { id: "role", label: "role", width: 180 },
  { id: "county", label: "county", width: 220 },
  { id: "state", label: "state", width: 180 },
  { id: "mailingAddress", label: "mailingAddress", width: 100 },
  { id: "Subscription", label: "Subscription", width: 100 },
  { id: "registrationReason", label: "Registration Reason", width: 100 },
  { id: "Created At", label: "Created At", width: 100 },
  { id: "options", label: "", width: 100 },
];

const UsersList = () => {
  const ref = useRef<ReturnType<typeof setTimeout>>();
  const settings = useSettingsContext();
  const [search, setSearch] = useState<string | null>(null);
  const table = useTable();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openId, setOpenId] = React.useState<null | number>(null);
  const [userEmail, setUserEmail] = React.useState<string>("");
  const open = Boolean(anchorEl);
  const { data, isSuccess } = useGetUsersQuery({
    page: table.page + 1,
    pageSize: table.rowsPerPage,
    search,
  });
  const [activate, { isLoading }] = useActivateFreeTrialMutation();
  const [expires, setExpires] = useState(NaN);
  const notFound = isSuccess && data?.data?.length === 0;
  console.log(data)
  const handleSearch = (value: string) => {
    if (ref.current) {
      window.clearTimeout(ref.current);
    }
    ref.current = setTimeout(() => {
      setSearch(value || null);
    }, 300);
  };

  const handleActivate = async () => {
    try {
      await activate({ email: userEmail, expiresInDays: expires }).unwrap();
      SnackbarUtils.success('Activated...')
      setUserEmail('')
    } catch (error) {
        // SnackbarUtils.error('Something went wrong...')
        console.log(error);
        
    }
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
    <>
      <Dialog open={!!userEmail} onClose={() => {
        setExpires(NaN)
      }}>
        <DialogTitle>Activate Free Trial</DialogTitle>
        <DialogContent>
          <TextField label="Free trial days" sx={{ my: 2 }} value={expires || ''} onChange={e => setExpires(Number(e.target.value))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserEmail('')}>Close</Button>
          <LoadingButton color="success" onClick={handleActivate} loading={isLoading}>Activate</LoadingButton>
        </DialogActions>
      </Dialog>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Users"
          links={[]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            flexGrow={1}
            sx={{ width: 1, p: 2 }}
          >
            <TextField
              fullWidth
              placeholder="Search by name or email"
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={data?.data.length || 0}
                />
                <TableBody>
                  {data?.data.map((el) => (
                    <TableRow hover key={el.id}>
                      <TableCell>{`${el.firstName} ${el.lastName}`}</TableCell>
                      <TableCell>{el.email}</TableCell>
                      <TableCell>{el?.source}</TableCell>
                      <TableCell>{el.role}</TableCell>
                      <TableCell>{el.county}</TableCell>
                      <TableCell>{el.state}</TableCell>
                      <TableCell>{el.mailingAddress}</TableCell>
                      <TableCell>{el.subscriptionType}</TableCell>
                      <TableCell>{el.registrationReasons.join(',')}</TableCell>
                      <TableCell>{moment(el.dateCreated).format('MM/DD/YYYY')}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setOpenId(el.id);
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                        <Menu
                          id="long-menu"
                          MenuListProps={{
                            "aria-labelledby": "long-button",
                          }}
                          anchorEl={anchorEl}
                          open={open && el.id === openId}
                          onClose={() => {
                            setAnchorEl(null);
                            setOpenId(null);
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              setAnchorEl(null);
                              setOpenId(null);
                              setUserEmail(el.email);
                            }}
                            sx={{ background: "white !important" }}
                          >
                            Activate Free Trial
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <TablePaginationCustom
            count={data?.pagination.totalCount || 0}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
};

export default UsersList;
