import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth0 } from "@auth0/auth0-react";

export default function SimpleCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const handleLogin = async () => {
    // const accessToken = await getAccessTokenSilently();
    // const loginResponse = await fetch("https://dev-6d0rlv0acg7xdkxt.us.auth0.com/authorize?response_type=token&client_id=2EHZJm086BzkgwY5HXmPeK5UnbHegBXl&connection=google-oauth2&redirect_uri=http://localhost:3000", {
    //   method: "GET",
    //   // headers: {
    //   //   Authorization: `Bearer ${accessToken}`
    //   // },
    //   redirect: "follow"
    // });
    // if(loginResponse.redirected) window.location.href = loginResponse.url;
    // console.log("Login response: ", loginResponse);
    // const userAuth0 = await loginResponse.json();
    // console.log("userAuth0: ", userAuth0);
    await loginWithRedirect({
      appState: {
        returnTo: "/",
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool products ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={"blue.400"}>Forgot password?</Link>
              </Stack>
              <Button w={"full"} variant={"outline"} leftIcon={<FcGoogle />}>
                <Center>
                  <Text onClick={handleLogin}>Sign in with Google</Text>
                </Center>
              </Button>

              <Link
                to={
                  email === "admin@gmail.com" && password === "admin"
                    ? "/admin"
                    : email === "prueba@gmail.com" && password === "prueba"
                    ? "/"
                    : ""
                }
              >
                <Button
                  width={"full"}
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Link>
              <Stack pt={6}>
                <Text align={"center"}>
                  Don't you have a user?{" "}
                  <Link
                    style={{ color: "blue" }}
                    to="/signup"
                    color={"blue.400"}
                  >
                    Sign Up
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
