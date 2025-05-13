#!/bin/bash

# 這個腳本幫助您檢查 Kubernetes 叢集中的資源狀態

# 設置 kubeconfig
export KUBECONFIG=~/kubeconfig

# 顯示說明
echo "=== Kubernetes 資源狀態檢查工具 ==="
echo "此工具幫助您檢查和管理 K3s 叢集上的資源"
echo "域名: blog.sj-sphere.com"
echo

# 檢查 Pod 狀態
echo "📊 Pod 狀態:"
kubectl get pods -o wide
echo

# 檢查 Deployment 狀態
echo "📊 Deployment 狀態:"
kubectl get deployments
echo

# 檢查 Service 狀態
echo "📊 Service 狀態:"
kubectl get services
echo

# 檢查 Ingress 狀態
echo "📊 Ingress 狀態:"
kubectl get ingress
echo

# 檢查 Certificate 狀態
echo "📊 SSL 證書狀態:"
kubectl get certificates
kubectl get certificaterequests
echo

# 檢查 ClusterIssuer 狀態
echo "📊 ClusterIssuer 狀態:"
kubectl get clusterissuers
kubectl describe clusterissuer letsencrypt-prod | grep -A5 "Status:"
echo

# 檢查 Secret 狀態
echo "📊 Secret 狀態:"
kubectl get secrets
kubectl get secret blog-sj-sphere-tls -o yaml 2>/dev/null | grep -q tls.crt && echo "✅ TLS 證書已經生成" || echo "❌ TLS 證書尚未生成"
echo

# 檢查節點狀態
echo "📊 節點狀態:"
kubectl get nodes
echo

# 提供常用命令提示
echo "=== 常用命令快速參考 ==="
echo "查看 Pod 日誌: kubectl logs <pod名稱>"
echo "進入 Pod shell: kubectl exec -it <pod名稱> -- /bin/sh"
echo "刪除並重新創建 Pod: kubectl delete pod <pod名稱>"
echo "重啟 Deployment: kubectl rollout restart deployment/<deployment名稱>"
echo "查看 Pod 詳細信息: kubectl describe pod <pod名稱>"
echo

# 檢查是否有 Pod 處於非運行狀態
NOT_RUNNING_PODS=$(kubectl get pods | grep -v "Running" | grep -v "NAME" || true)
if [ -n "$NOT_RUNNING_PODS" ]; then
  echo "⚠️ 警告: 檢測到非運行狀態的 Pod:"
  echo "$NOT_RUNNING_PODS"
  echo
  echo "請使用 'kubectl describe pod <pod名稱>' 查看詳細信息"
fi

# 顯示 Ingress URL
INGRESS_HOST=$(kubectl get ingress -o jsonpath='{.items[0].spec.rules[0].host}')
if [ -n "$INGRESS_HOST" ]; then
  echo "🌐 您的應用程序可以通過以下 URL 訪問:"
  echo "https://$INGRESS_HOST (SSL 啟用後)"
  echo "http://$INGRESS_HOST (備用)"
  
  # 檢查 TLS 證書是否已生成
  if kubectl get secret blog-sj-sphere-tls -o yaml 2>/dev/null | grep -q tls.crt; then
    echo "✅ SSL 憑證已生效，可以使用 HTTPS 連接"
  else
    echo "⏳ SSL 憑證生成中，請稍後再試 HTTPS 連接"
    echo "   可以使用 'kubectl describe certificate <certificate-name>' 查看詳細狀態"
  fi
  echo
fi
