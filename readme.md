
`req.query`

`req.body`

`req.params`

`req.file`

`req.files`

`req.session`

------

#### res.end() 不會設定檔頭

res.end()

res.send()

res.json()

res.render()

res.redirect()

------


# <font color="#f00">RESTful API</font>

## CRUD


### 列表 (GET)
/products

/products?page=2

/products?page=2&search=找東西

### 單一商品 (GET)
/products/:id

### 新增商品 (POST)
/products

### 修改商品 (PUT)
/products/:id

### 刪除商品 (DELETE)
/products/:id


---

# cart table 購物車的資料表參考

PK

item_type: product, event, ticket

user_id

item_id :12

quantity

created_at















