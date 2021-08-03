import { expect } from "chai";
import { isPositiveInt, isPositiveNumber } from "@/util";

describe("Utilities", function () {
  describe("#isPositiveInt", function () {
    it("should validate positive int", function () {
      expect(isPositiveInt("0")).to.be.true;
      expect(isPositiveInt("3")).to.be.true;
      expect(isPositiveInt("159")).to.be.true;
    });
  });
  describe("#isPositiveNumber", function () {
    it("should validate positive int", function () {
      expect(isPositiveNumber("0")).to.be.true;
      expect(isPositiveNumber("3")).to.be.true;
      expect(isPositiveNumber("159")).to.be.true;
    });
    it("should validate floating point", function () {
      expect(isPositiveNumber("0.1")).to.be.true;
      expect(isPositiveNumber("3.232")).to.be.true;
      expect(isPositiveNumber("159.654")).to.be.true;
    });
    it("should validate floating point with comma", function () {
      expect(isPositiveNumber("0,1")).to.be.true;
      expect(isPositiveNumber("3,232")).to.be.true;
      expect(isPositiveNumber("159,654")).to.be.true;
    });
    it("should not validate negative int", function () {
      expect(isPositiveNumber("-1")).to.be.false;
      expect(isPositiveNumber("-3")).to.be.false;
      expect(isPositiveNumber("-159")).to.be.false;
    });
    it("should not validate random string", function () {
      expect(isPositiveNumber("1ere")).to.be.false;
      expect(isPositiveNumber("balbel")).to.be.false;
      expect(isPositiveNumber("ddf12")).to.be.false;
    });
  });
});
