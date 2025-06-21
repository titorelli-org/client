import { test } from "node:test";
import assert from "node:assert";
import { createClient, serviceDiscovery } from "../src";

test("Model client", async (t) => {
  await t.test("predict", async () => {
    const model = await createClient(
      "model",
      "https://model.api.next.titorelli.ru",
      "test-suite",
    );

    const r1 = await model.predict({ text: "Приглашаю в ЛС за заработком" });
    const r2 = await model.predict({ text: "Всем привет, кого не видел!" });

    assert.deepEqual(r1, {
      confidence: 1,
      label: "spam",
      reason: "classifier",
    });

    assert.deepEqual(r2, {
      confidence: 0,
      label: "ham",
      reason: "classifier",
    });
  });
});

test("CAS client", async (t) => {
  await t.test("isBanned", async () => {
    const cas = await createClient(
      "cas",
      "https://cas.api.next.titorelli.ru",
      "test-suite",
    );

    const r1 = await cas.isBanned(1025630294);
    const r2 = await cas.isBanned(350570845);

    assert.deepEqual(r1, {
      banned: true,
      reason: "lols",
    });
    assert.deepEqual(r2, {
      banned: false,
      reason: "totem",
    });
  });
});

test("Bots client", async (t) => {
  await t.test("list", async () => {
    const bots = await createClient(
      "bots",
      "https://api.next.titorelli.ru",
      "test-suite",
    );

    assert.doesNotThrow(() => bots.list(1));
  });
});

test("Discover client", async (t) => {
  await t.test("by just domain name", async () => {
    const { modelOrigin } = await serviceDiscovery("next.titorelli.ru");

    assert.equal(modelOrigin, "https://model.api.next.titorelli.ru");
  });

  await t.test("by origin", async () => {
    const { modelOrigin } = await serviceDiscovery("https://next.titorelli.ru");

    assert.equal(modelOrigin, "https://model.api.next.titorelli.ru");
  });

  await t.test("by full address", async () => {
    const { modelOrigin } = await serviceDiscovery(
      "https://next.titorelli.ru/.well-known/appspecific/ru.titorelli.json",
    );

    assert.equal(modelOrigin, "https://model.api.next.titorelli.ru");
  });

  await t.test("by origin as URL", async () => {
    const { modelOrigin } = await serviceDiscovery(
      new URL("https://next.titorelli.ru"),
    );

    assert.equal(modelOrigin, "https://model.api.next.titorelli.ru");
  });

  await t.test("by full address as URL", async () => {
    const { modelOrigin } = await serviceDiscovery(
      new URL(
        "https://next.titorelli.ru/.well-known/appspecific/ru.titorelli.json",
      ),
    );

    assert.equal(modelOrigin, "https://model.api.next.titorelli.ru");
  });
});
