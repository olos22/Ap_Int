create table cube
(
    id      integer not null
        constraint cube_pk
            primary key autoincrement,
    type text not null,
    size integer not null
);
