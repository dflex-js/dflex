import { Box, Grid, Stack, Text, Badge } from "@chakra-ui/react";
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
    { id: "mtgs", title: "meetings", cards: meetings, depth: 1 },
    { id: "evts", title: "events", cards: events, depth: 1 },
  ];
  return (
    <Stack px="8">
      <h1>Trello</h1>
      <Grid templateColumns={`repeat(${groups.length},1fr)`} gap="12">
        {groups.map((group) => (
          <TodoItem Component="div" depth={group.depth} id={group.id}>
            <Stack key={group.id} minW="280px">
              <h2>{group.title}</h2>
              <Stack as="ul" listStyleType="none" p="0">
                {group.cards.map((card) => (
                  <TodoItem key={card.id} id={card.id}>
                    <Box maxW="sm">
                      <Box
                        p="6"
                        backgroundColor="yellow.300"
                        textColor="gray.700"
                        fontSize="xl"
                        fontWeight="semibold"
                        fontFamily="cursive"
                        borderRadius="lg"
                      >
                        <Box>
                          <Badge
                            variant="solid"
                            borderRadius="lg"
                            bgColor="coral"
                            px="2"
                            py="1"
                          >
                            New
                          </Badge>
                          <Text>{card.msg}</Text>
                        </Box>
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
