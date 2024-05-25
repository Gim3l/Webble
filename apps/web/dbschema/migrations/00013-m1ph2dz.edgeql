CREATE MIGRATION m1ph2dzxa47csu77aafi64odvqonarnhf74khiei7devbmrletbolq
    ONTO m1a7kawi34fsi6ltn2i6rnoi7thj24i6ekzl66j72fcclugyklenra
{
  CREATE TYPE default::ChatHistory {
      CREATE REQUIRED LINK session: default::ChatSession;
      CREATE PROPERTY captures: std::json;
      CREATE PROPERTY created_at: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE PROPERTY message: std::str;
  };
  ALTER TYPE default::ChatSession {
      CREATE LINK history := (.<session[IS default::ChatHistory]);
  };
  ALTER TYPE default::ChatSession {
      DROP PROPERTY last_message;
  };
};
