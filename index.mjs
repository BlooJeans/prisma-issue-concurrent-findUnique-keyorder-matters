import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.relationship.deleteMany();
  await prisma.foo.deleteMany();
  await prisma.bar.deleteMany();

  await prisma.foo.createMany({
    data: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }],
  });

  await prisma.bar.createMany({
    data: [{ id: "5" }, { id: "6" }],
  });

  await prisma.relationship.createMany({
    data: [
      { fooId: "1", barId: "5" },
      { fooId: "1", barId: "6" },

      { fooId: "2", barId: "5" },
      { fooId: "3", barId: "5" },

      { fooId: "4", barId: "6" },
    ],
  });

  const fooId = "1";
  const barId = "5";

  const funcA = () =>
    prisma.relationship.findUnique({
      where: {
        fooId_barId: {
          // note the order of these two keys
          fooId,
          barId,
        },
      },
    });

  const funcB = () =>
    prisma.relationship.findUnique({
      where: {
        fooId_barId: {
          // note the order of these two keys
          barId,
          fooId,
        },
      },
    });

  console.log();
  console.log("runTest 1: consistent order");
  await runTest(funcA, funcA);

  console.log();
  console.log("runTest 2: different, but still consistent order");
  await runTest(funcB, funcB);

  console.log();
  console.log("runTest 3: differing orders");
  await runTest(funcA, funcB);

  // just for completeness sake
  console.log();
  console.log("runTest 4: reverse but still different orders");
  await runTest(funcB, funcA);
};

async function runTest(getRow1, getRow2) {
  const seqRow1 = await getRow1();
  const seqRow2 = await getRow2();

  const [concurrentRow1, concurrentRow2] = await Promise.all([
    getRow1(),
    getRow2(),
  ]);

  console.log({
    seqRow1: !!seqRow1,
    seqRow2: !!seqRow2,
    concurrentRow1: !!concurrentRow1,
    concurrentRow2: !!concurrentRow2,
  });

  if (seqRow1.id !== concurrentRow1?.id || seqRow2.id !== concurrentRow2?.id) {
    console.error(`!!!!!!!! Error: concurrent usage did not match`);
  }
}

main().catch((error) => console.error(error));
