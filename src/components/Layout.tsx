import Image from 'next/image'
import logo from '@/public/enpal-logo.svg'
import {Inter} from "next/font/google";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import {Link} from "react-router-dom";
import {ListItemDecorator, ModalClose, ModalDialog} from "@mui/joy";
import {Home as HomeIcon, Settings} from "@mui/icons-material";
import React, {useState} from "react";
import Modal from "@mui/joy/Modal";
import {EditGeneralParams} from "@/src/components/EditGeneralParams";

const inter = Inter({subsets: ['latin']})

export default function Layout({children}) {
    const [openModal, setOpenModal] = useState(false);
    return (
        <>
            <div className="absolute top-0 left-0 bg-gray-100 w-full flex">
                <Image id="enpal-logo" src={logo} alt="Enpal ." className="block w-[100px] h-[50px] mx-auto p-[5px]"/>
            </div>
            <main className="flex flex-col justify-between items-center p-24 h-screen w-screen">{children}</main>
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
        </>
    )
}