CREATE MIGRATION m1l6hw6yi43nprnohwgo5y3phdblbntexq46d3bki6df5uoegdpe5a
    ONTO m1euj62qlmnqp6fjayuea667srl64vbppn3toxqngtg7lqaezg5kza
{
  ALTER TYPE default::User {
      ALTER LINK identity {
          RESET OPTIONALITY;
      };
  };
};
