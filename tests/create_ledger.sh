



MINTER=$(dfx --identity default identity get-principal)
RECIEVER=$(dfx --identity reciever identity get-principal) # m2zqz-pr5r2-ozayk-w5trf-mt6mw-7vuys-mitrw-4qdpb-dm5p7-77ey6-fae
PRO=$(dfx --identity minter identity get-principal) # rmehg-adw5r-6trpq-epk4r-tyl4c-dd2u4-erbw4-kcjzr-rrjpf-dfvi2-oae
BHANU=$(dfx --identity Bhanu identity get-principal)  # yxtej-lmfuu-rp3yv-xzu2h-6q43c-7iast-yiwff-z552q-6ugas-pyd6b-fae


DAO_CANISTER=(dfx canister id dao_canister)

RES=(
  dfx canister call daohouse_backend create_ledger '(
  
    "$DAO_CANISTER",
    
  )'
)