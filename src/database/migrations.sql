use pos_dev;

create table users(
	id int auto_increment primary key unique not null,
    name varchar(50) not null,
    email varchar(150) not null unique,
    email_verified tinyint default(0),
    password varchar(255) not null,
    on_shift tinyint default(0) not null,
    is_admin tinyint default(0) not null,
    active tinyint default(0) not null,
    created_at timestamp default now(),
    updated_at timestamp default now() on update now()
);

-- creating a products table for all product in the store
create table products (
	id int not null primary key unique auto_increment,
    barcode varchar(50) not null unique,
    name varchar(150) not null,
    type varchar(100) not null,
    unit_price decimal(9,2) not null,
    quantity int not null default(0),
    created_at timestamp default now(),
    updated_at timestamp default now() on update now()
);
-- create an unique index for products.barcode
create index product_barcode on products (barcode);

-- sales recording
create table sales (
	id int not null primary key unique auto_increment,
    user_id int not null,
    total_price float(9,2) not null,
    is_cash tinyint default(1) not null,
    cash float(9,2),
    cash_change float(9,2),
	created_at timestamp default now(),
    updated_at timestamp default now() on update now(),
    -- user id foreign on users table id
    foreign key (user_id) references users(id)
);

-- sales product list 
create table sale_product_lists (
	id int not null primary key unique auto_increment,
    sale_id int not null,
    product_id int not null,
    quantity int not null,
    total_price float(9,2) not null,
	created_at timestamp default now(),
    updated_at timestamp default now() on update now(),
    -- sales and products foreign key references
    foreign key (sale_id) references sales(id),
    foreign key (product_id) references products(id)
);

-- stocking record of all stock have been made 
create table stockings (
	id int not null primary key unique auto_increment,
    user_id int not null,
    stock_price float(9,2) not null,
    created_at timestamp default now(),
    updated_at timestamp default now() on update now(),
    -- user id foreign on users table 
    foreign key (user_id) references users(id)
);

-- stock list
create table stocking_lists (
	id int not null primary key unique auto_increment,
    stocking_id int not null,
    product_id int not null,
    items int not null,
    total_price float(9,2) not null,
    created_at timestamp default now(),
    updated_at timestamp default now() on update now(),
    -- storkings and products of foreign references
    foreign key (stocking_id) references stockings(id),
    foreign key (product_id) references products(id)
);


-- creating a coupons table for discount in the store
create table coupons (
	id int not null primary key unique auto_increment,
    user_id int not null,
    code varchar(50) not null unique,
    description text,
    price decimal(9,2) not null,
    use_qty int not null default(0),
    active tinyint not null default(0),
    for_cash tinyint not null default(0),
    for_credit_card tinyint not null default(1),
    exp_at timestamp default now(),
    created_at timestamp default now(),
    updated_at timestamp default now() on update now(),
    -- reference user who created coupon
    foreign key (user_id) references users(id)
);