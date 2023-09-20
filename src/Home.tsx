import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import ClientList from "./clientlist/ClientList"
import ComparisonStats from "@/src/comparison/stats/ComparisonStats";
import ComparisonChart from "./comparison/chart/ComparisonChart";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers";
import React, {ReactElement, useState} from "react";
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import MenuIcon from '@mui/icons-material/Menu';
import {Home as HomeIcon, Settings} from "@mui/icons-material";
import {ListItemDecorator, ModalClose, ModalDialog} from "@mui/joy";
import Modal from "@mui/joy/Modal";
import {CreateClient} from "@/src/components/CreateClient";
import {EditGeneralParams} from "@/src/components/EditGeneralParams";

export function Home(): ReactElement {
    const [openModal, setOpenModal] = useState(false);
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ClientList/>}/>
                    <Route path="/comparison/chart/:clientId" element={<ComparisonChart/>}/>
                    <Route path="/comparison/stats/:clientId" element={<ComparisonStats/>}/>
                </Routes>
                <div className="absolute top-2 right-1 ">
                    <Dropdown>
                        <MenuButton
                            variant="plain" startDecorator={<MenuIcon/>}>
                        </MenuButton>
                        <Menu
                            variant="outlined"
                            placement="bottom-end">
                            <MenuItem component={Link} to="/">
                                <ListItemDecorator>
                                    <HomeIcon/>
                                </ListItemDecorator>
                                Client List
                            </MenuItem>
                            <MenuItem onClick={() => setOpenModal(true)}>
                                <ListItemDecorator>
                                    <Settings/>
                                </ListItemDecorator>
                                General Params
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                </div>
                <Modal open={openModal}
                       onClose={() => setOpenModal(false)}>
                    <ModalDialog
                        color="neutral"
                        variant="outlined"
                        className="h-[60%] w-[60%] justify-center"
                    >
                        <ModalClose/>
                        <EditGeneralParams setOpenModal={setOpenModal}/>
                    </ModalDialog>
                </Modal>
            </BrowserRouter>
        </LocalizationProvider>
    )
}
