# AWS EC2 セルフホスト Dify (api.shioki.com) 障害時の確認手順

**症状**: `http://api.shioki.com/` に応答なし（ping 100% loss、curl タイムアウト）

---

## 1. AWS コンソールで確認すること

### 1-1. EC2 インスタンスの状態

| 確認項目 | 想定原因・対処 |
|----------|----------------|
| **インスタンス状態** | `running` か？ `stopped` なら起動。`terminated` なら再作成が必要。 |
| **ステータスチェック** | 「2/2 のチェックに合格」か？ 不合格なら再起動を検討。 |
| **CPU/メモリ（CloudWatch）** | スパイク後ずっと高止まり → OOM や負荷でプロセス落ちの可能性。 |
| **ディスク（EBS）** | 容量逼迫で書き込み失敗・Docker/ログが止まっている可能性。 |

### 1-2. セキュリティグループ

- **インバウンド**: `0.0.0.0/0` またはあなたのIP から **80 (HTTP)** / **443 (HTTPS)** が許可されているか。
- **ping**: ICMP が許可されていなくても Web は動くことがあるので、ping 失敗だけでは「HTTP が塞がっている」とは限らない（curl が重要）。

### 1-3. Elastic IP / ドメイン

- **Elastic IP** がインスタンスにアタッチされたままか（停止→起動で外れることがある）。
- **api.shioki.com** の DNS がその Elastic IP（例: 3.113.28.241）を指しているか。

---

## 2. SSH 接続の準備（この環境）

- **鍵**: `dify-20251207.pem` を別 OS からコピーし、`~/.ssh/dify-20251207.pem` に置く。
- **パーミッション**: `chmod 400 ~/.ssh/dify-20251207.pem`
- **接続**: `ssh dify` または `ssh-dify`（`~/.bashrc` のエイリアス）。  
  インスタンス: `i-0c88205e61b69aff6` (kindle-dify-project)、ユーザー: `ubuntu`。
- **Dify のディレクトリ**: `~/dify`（`/home/ubuntu/dify`）。`docker compose` はこのディレクトリで実行する。

---

## 3. インスタンスにログインできる場合（SSH）

以下は **EC2 に SSH で入れる** ことを前提にした確認です。

### 3-1. Dify (Docker) の状態

```bash
# Dify のコンテナ一覧（起動・停止どちらも）
docker ps -a

# 直近のログ（nginx / api など）
docker compose logs --tail=100
# または
docker-compose logs --tail=100
```

- コンテナが `Exited` なら `docker compose up -d`（または `docker-compose up -d`）で再起動。
- `docker compose up` をフォアグラウンドで実行すると、エラーメッセージがその場で出るので原因切り分けに便利。

### 3-2. リソース不足の有無

```bash
# メモリ・スワップ
free -h

# ディスク（/ と /var が満杯だと Dify/DB が止まる）
df -h

# 直近の OOM やカーネルメッセージ
sudo dmesg | tail -50
journalctl -xe --no-pager | tail -80
```

- メモリ不足で OOM Killer が動くと、`dmesg` に "Out of memory" などが出る。
- ディスク 100% に近い場合は、ログ削除・不要イメージ削除で空ける。

### 3-3. サービスがリスンしているか

```bash
# 80/443 をリッスンしているプロセス
sudo ss -tlnp | grep -E ':80|:443'
# または
sudo netstat -tlnp | grep -E ':80|:443'
```

- 何も出ない場合は nginx や Dify のコンテナが落ちている可能性が高い。

### 3-4. ファイアウォール（インスタンス内）

```bash
# firewalld
sudo firewall-cmd --list-all

# ufw
sudo ufw status
```

- 80/443 が DROP されていないか確認。

---

## 4. よくある「途中で止まった」パターン

| 状況 | 可能性の高い原因 |
|------|------------------|
| ある日を境に一切応答しなくなった | EC2 停止、Elastic IP の取り外し、または OOM/ディスク満杯でプロセス全停止。 |
| 処理の途中で止まる（Dify の実行が完了しない） | メモリ不足、タイムアウト、Dify ワーカー/API のクラッシュ。ログで `api` / `worker` のエラーを確認。 |
| ping だけ失敗して HTTP は（以前）動いていた | ICMP が SG で閉じているだけの可能性。今回のように curl も通らなければインスタンス or コンテナの問題。 |

---

## 4. すぐ試せる復旧の流れ（まとめ）

1. **AWS コンソール**: インスタンスが `running` か、EIP がアタッチされているか確認。
2. **SSH でログイン** → `docker ps -a` でコンテナ状態確認。
3. **`Exited` のコンテナ** があれば `docker compose up -d`（Dify のディレクトリで実行）。
4. **まだ応答しない** 場合は `df -h` と `free -h`、`dmesg` でリソースと OOM を確認。
5. **ディスク逼迫** ならログ・未使用 Docker イメージの削除後、再度 `docker compose up -d`。

---

## 6. このリポジトリとの関係

- **books.shioki.com**: GitHub Pages（このリポジトリ）で提供。
- **api.shioki.com**: AWS EC2 上のセルフホスト Dify（別インフラ）。

Dify が復旧すれば、Books Portfolio から API を呼ぶ設定にすれば、書評・4コマ生成などの連携が再開できます。

---

*最終更新: 2025-01*
