CREATE MIGRATION m1pqdnvjiqh3xgyfs3rv6pm5epyk2muw6dsnbesbh32g75zuxwflvq
    ONTO m1mlajagtj7l56ynokdovlkxhrwcpl6zatkwat5jfcpviu7iinqanq
{
  ALTER TYPE default::Form {
      CREATE REQUIRED PROPERTY structure: std::json {
          SET REQUIRED USING (<std::json>{});
      };
  };
};
