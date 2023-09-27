const Coffee = require("../models/coffee");

module.exports = {
  search,
};

async function search(req, res) {
  const query = req.query.searchQuery;
  const sanitizedQuery = query.replace(/\s+/g, "").toLowerCase();

  try {
    const foundCoffees = await Coffee.aggregate([
      {
        $match: {
          $or: [
            {
              $expr: {
                $eq: [
                  {
                    $toLower: {
                      $replaceAll: {
                        input: "$name",
                        find: " ",
                        replacement: "",
                      },
                    },
                  },
                  sanitizedQuery,
                ],
              },
            },
            {
              $expr: {
                $eq: [
                  {
                    $replaceAll: {
                      input: {
                        $toLower: "$roaster",
                      },
                      find: " ",
                      replacement: "",
                    },
                  },
                  sanitizedQuery,
                ],
              },
            },
          ],
        },
      },
    ]).exec();

    res.render("coffee/results", { coffees: foundCoffees });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
}
