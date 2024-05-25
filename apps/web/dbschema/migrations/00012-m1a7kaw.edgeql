CREATE MIGRATION m1a7kawi34fsi6ltn2i6rnoi7thj24i6ekzl66j72fcclugyklenra
    ONTO m1kmk5dm7xdcd7bs34dl3kdosxkobc2hswd4twqvnrv2czskkvyg7q
{
  ALTER TYPE default::ChatSession {
      CREATE PROPERTY last_message: std::str;
  };
  ALTER TYPE default::ChatSession {
      CREATE PROPERTY last_group: std::json;
      DROP PROPERTY state;
  };
};
