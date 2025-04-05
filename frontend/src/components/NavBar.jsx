import { Container, Flex, HStack, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
export const NavBar = () => {
   return (
      <Container fontSize={["14px", "20px"]} color={"white"} maxW={2000} bg={"f1.500"}>
         <HStack h="4.375rem" gap={0} mx={[2, 5, 20]}>
            <Flex mr={10}>
               <Link to="/">
                  <Image
                     h={[50, 69.7]}
                     w={[100, 150]}
                     src="https://www.formula1.com/etc/designs/fom-website/images/f1_logo.svg"
                     alt="Formula 1 Logo"
                  />
               </Link>
            </Flex>

            <HStack h={"100%"}>
               <Flex
                  h={"100%"}
                  alignItems={"center"}
                  p={4}
                  _hover={{ bg: "black", transition: "all 0.3s ease" }}
                  cursor="pointer"
               >
                  <Text>
                     <Link to={"/drivers"}>Drivers Standing</Link>
                  </Text>
               </Flex>
               <Flex
                  h={"100%"}
                  alignItems={"center"}
                  p={4}
                  _hover={{ bg: "black", transition: "all 0.3s ease" }}
                  cursor="pointer"
               >
                  <Text>
                     <Link to={"/constructors"}>Constructors Standing</Link>
                  </Text>
               </Flex>
            </HStack>
         </HStack>
      </Container>
   );
};
