CREATE MIGRATION m1kmk5dm7xdcd7bs34dl3kdosxkobc2hswd4twqvnrv2czskkvyg7q
    ONTO m1xn2gkyaebk4inluziaee2cg5tt3hwbnmk4bzukbomuaq5z34bz5q
{
  ALTER TYPE default::Form {
      CREATE PROPERTY published: std::bool {
          SET default := false;
      };
  };
};
