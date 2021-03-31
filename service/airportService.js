const { Op } = require("sequelize");
const { Airport } = require("@utopia-airlines-wss/common/models");
const { NotFoundError } = require("@utopia-airlines-wss/common/errors");
const { removeUndefined } = require("@utopia-airlines-wss/common/util");

const airportService = {
  async findAirportById(iataId) {
    const airport = await Airport.findByPk(iataId.toUpperCase(), {
      include: ["departureRoutes", "arrivalRoutes"],
    });
    if (!airport) throw new NotFoundError("cannot find airport");
    return airport;
  },
  async findAllAirports({ offset = 0, limit = 20, airport }) {
    console.log(offset, limit, airport);
    let query= null;
    if(airport){
      query = {
        [Op.or]:   [
          { iataId: { [Op.substring]: airport } },
          { name: { [Op.substring]: airport } },
          { city: { [Op.substring]: airport } },
          { country: { [Op.substring]: airport } },
        ]
      };
    }
    return Airport.findAndCountAll({
      limit: +limit,
      offset: +offset,
      where: query,
      include: ["departureRoutes", "arrivalRoutes"],
    });
  },
};

module.exports = airportService;
