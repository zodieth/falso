import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { useAppDispatch } from "../app/hooks";
import {
  fetchProductsApi,
  fetchBrandApi,
  fetchCategoryApi,
} from "../app/actionsCreators";
import { auth } from "../auth0.service";
import ToggleColorMode from "../components/DarkMode/ToggleColorMode";
import { AUTH_MANAGEMENT_API_ACCESS_TOKEN } from "../auth0.config";

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, url: "/admin" },
  { name: "Productos", icon: FiTrendingUp, url: "/admin/products" },
  {
    name: "Categorias",
    icon: FiCompass,
    url: "/admin/categories",
  },
  { name: "Marcas", icon: FiStar, url: "/admin/brands" },
  { name: "Sucursales", icon: FiSettings, url: "#" },
  { name: "Usuarios", icon: FiSettings, url: "#" },
];

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductsApi());
    dispatch(fetchBrandApi());
    dispatch(fetchCategoryApi());
  }, [dispatch]);
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}> {/* el centro del panel */}
      
      <SidebarContent  /* menu de la izquierda */
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer 
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav  onOpen={onOpen} /> {/* panel de arriba donde esta el admin */}
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

//formacion del menu de la izquierda
const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box  /* Menu de la izquierda y sus caracteristicas */
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    > <ToggleColorMode /> {/* boton modo noche */}
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Link href="/admin">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Logo
          </Text>
        </Link>

        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} url={link.url}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  url: string;
}

//items que van en el menu de la izquierda
const NavItem = ({ icon, children, url, ...rest }: NavItemProps) => {
  return (
    <Link
      href={url}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [userName, setUserName] = useState("");
  const [picture, setPicture] = useState("");

  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const activeSession = accessToken ? true : false;
  const handleUser = async () => {
    await auth.client.userInfo(accessToken, async (error : Auth0Error | null, user : Auth0UserProfile) => {
      if(error) {
        console.log("Error: ", error);
        navigate("/");
      } else {
        const userId = user.sub;
        const userRolesResponse = await fetch(`https://dev-6d0rlv0acg7xdkxt.us.auth0.com/api/v2/users/${userId}/roles`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${AUTH_MANAGEMENT_API_ACCESS_TOKEN}`
          }
        });
        const userRoles = await userRolesResponse.json();
        const hasAdminRole = userRoles.some((role : { id : String, name : String, description : String }) => role.name === "alltech-admin");
        if(!hasAdminRole) navigate("/");
        setUserName(user.nickname);
        setPicture(user.picture);
      };
    })
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    auth.logout({
      returnTo: window.location.origin,
      clientID: "2EHZJm086BzkgwY5HXmPeK5UnbHegBXl"
    });
  };

  useEffect(() => {
    if(!activeSession) navigate("/");
    handleUser();
  }, [handleUser]);
  return (
    <Flex /* devuelta es la barra donde esta la parte del administrador arriba */
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}> {/* seccion chiquita donde esta la parte del administrador */}
        {" "}
        {/* Arriba a la derecha */}
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    picture
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{userName}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Administrador
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={() => navigate("/cart")}>Mi carrito de compras</MenuItem>
              <MenuItem onClick={() => navigate("/user")}>Mi cuenta de usuario</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => navigate("/")}>Volver a la tienda</MenuItem>
              <MenuItem onClick={handleLogout}>Salir</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
