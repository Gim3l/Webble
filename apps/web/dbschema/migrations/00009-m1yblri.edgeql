CREATE MIGRATION m1yblri6ivenf325vwgwmhhan7pkzrfj4vmf2ejnb7eg5suci64qca
    ONTO m1l6hw6yi43nprnohwgo5y3phdblbntexq46d3bki6df5uoegdpe5a
{
  ALTER TYPE default::User {
      ALTER LINK identity {
          SET REQUIRED USING (<ext::auth::Identity>{});
      };
  };
};
