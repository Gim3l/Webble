CREATE MIGRATION m1xn2gkyaebk4inluziaee2cg5tt3hwbnmk4bzukbomuaq5z34bz5q
    ONTO m1yblri6ivenf325vwgwmhhan7pkzrfj4vmf2ejnb7eg5suci64qca
{
  ALTER TYPE default::ChatSession {
      ALTER LINK form {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::FormVariable {
      ALTER LINK form {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
