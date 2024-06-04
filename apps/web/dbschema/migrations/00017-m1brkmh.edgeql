CREATE MIGRATION m1brkmh53wyhndyok2gwnqybe55zqwrboqxn3iq2qgiqruftgekita
    ONTO m1pqdnvjiqh3xgyfs3rv6pm5epyk2muw6dsnbesbh32g75zuxwflvq
{
  ALTER TYPE default::ChatHistory {
      ALTER LINK session {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  CREATE TYPE default::Image {
      CREATE REQUIRED LINK project: default::Form;
      CREATE PROPERTY created_at: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE REQUIRED PROPERTY key: std::str;
  };
};
