import { Box, Grid, Stack, Text, Badge, Flex, Button } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import TodoItem from "../../DnDComponent";
const Trello = () => {
  const meetings = [
    { id: "mtg12x", msg: "Meet with Laura" },
    { id: "mtg1x", msg: "Meet v1" },
    { id: "mtg2x", msg: "Meet v2" },
    { id: "mtg3x", msg: "Meet v3" },
  ];
  const events = [
    { id: "evt1x", msg: "Meet v1" },
    { id: "evt2x", msg: "Meet v2" },
    { id: "evt3x", msg: "Meet v3" },
    { id: "evt4x", msg: "Meet v4" },
  ];
  const groups = [
    { id: "mtgs", title: "Meetings", cards: meetings, depth: 1 },
    { id: "evts", title: "Events", cards: events, depth: 1 },
  ];
  return (
    <Stack px="8">
      <h1>Trello</h1>
      <Grid templateColumns={`repeat(${groups.length},1fr)`} gap="12">
        {groups.map((group) => (
          <TodoItem Component="div" depth={group.depth} id={group.id}>
            <Stack key={group.id} maxW="420px">
              <h2>{group.title}</h2>
              <Stack as="ul" listStyleType="none" p="0">
                {group.cards.map((card) => (
                  <TodoItem key={card.id} id={card.id}>
                    <Box maxW="sm" shadow="xl">
                      <Box
                        px="4"
                        py="6"
                        backgroundColor="yellow.300"
                        textColor="gray.700"
                        fontSize="xl"
                        fontWeight="semibold"
                        fontFamily="cursive"
                        borderRadius="lg"
                      >
                        <Stack>
                          <Flex justifyContent="space-between">
                            <Box>
                              <Badge
                                variant="solid"
                                borderRadius="xl"
                                bgColor="coral"
                                px="2"
                                py="1"
                                cursor="default"
                              >
                                {card.id}
                              </Badge>
                            </Box>
                            <Box>
                              <Button
                                size="xs"
                                p="0.5"
                                rounded="full"
                                bgColor="gray.900"
                                _hover={{ bgColor: "gray.700" }}
                                _focus={{ bgColor: "gray.600" }}
                                variant="outline"
                              >
                                <CloseIcon />
                              </Button>
                            </Box>
                          </Flex>
                          <Box mt="4">
                            <Text
                              p="2"
                              border="2px"
                              borderColor="gray.600"
                              bgColor="whiteAlpha.600"
                              fontSize="lg"
                              _focus={{ outline: 0 }}
                              contentEditable
                            >
                              {card.msg}
                            </Text>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  </TodoItem>
                ))}
              </Stack>
            </Stack>
          </TodoItem>
        ))}
      </Grid>
    </Stack>
  );
};

export default Trello;
