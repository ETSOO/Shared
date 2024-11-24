import { ContentDisposition } from "../src/types/ContentDisposition";

test("Tests for parse", () => {
  const cd1 = ContentDisposition.parse(
    "attachment; filename=__PDF.pdf; filename*=UTF-8''%E6%B5%8B%E8%AF%95PDF.pdf"
  );

  const cd2 = ContentDisposition.parse(
    `attachment; filename="__PDF.pdf"; filename*="UTF-8''%E6%B5%8B%E8%AF%95PDF.pdf"`
  );

  expect(cd1?.type).toBe(cd2?.type);
  expect(cd1?.filename).toBe(cd2?.filename);
  expect(cd1?.filename).toBe("测试PDF.pdf");
});

test("Tests for format", () => {
  const cd1 = new ContentDisposition("form-data", "a-b.jpg", "file");
  expect(cd1.format()).toBe(`form-data; name="file"; filename="a-b.jpg"`);
  const cd2 = new ContentDisposition("attachment", "测试PDF.pdf");
  expect(cd2.format()).toBe(
    `attachment; filename="__PDF.pdf"; filename*="UTF-8''%E6%B5%8B%E8%AF%95PDF.pdf"`
  );
});
