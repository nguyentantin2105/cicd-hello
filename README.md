# cicd-hello

A tiny static "hello world" site for learning **GitHub Actions CI/CD**.

## What's inside

```
src/                # source files served as the website
  index.html
  styles.css
  script.js
tests/              # Jest unit tests
build.js            # copies src/ -> dist/ and stamps a build id
.github/workflows/
  ci-cd.yml         # lint -> test -> build -> deploy to GitHub Pages
```

## Pipeline overview

`.github/workflows/ci-cd.yml` runs three jobs:

1. **Lint & Test** — runs ESLint and Jest on every push and PR to `main`.
2. **Build** — runs only if lint+test pass; produces `dist/` and uploads it as a Pages artifact.
3. **Deploy** — runs only on pushes to `main`; publishes the artifact to GitHub Pages.

## Run locally

```bash
npm install
npm run lint
npm test
npm run build
open dist/index.html   # macOS — preview the built site
```

## Push to GitHub

```bash
git init
git add .
git commit -m "initial commit: hello CI/CD"
git branch -M main
# create a new empty repo on GitHub first, then:
git remote add origin git@github.com:<your-username>/cicd-hello.git
git push -u origin main
```

## Enable GitHub Pages

In your repo on GitHub:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` again (or re-run the workflow). The `deploy` job will publish your site at:
   `https://<your-username>.github.io/cicd-hello/`

## Deploy to local Kubernetes (kind)

The CI workflow also publishes a container image to **GHCR** on every push to `main`:
`ghcr.io/nguyentantin2105/cicd-hello:latest` (plus `:<short-sha>` and `:main` tags).

### One-time setup

```bash
# 1. Install tools (macOS)
brew install kind kubectl helm

# 2. Create a kind cluster with port 80/443 mapped to host
kind create cluster --name cicd-hello --config k8s/kind-config.yaml

# 3. Install ingress-nginx (the kind-flavored manifest)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# 4. Map the ingress host locally
echo "127.0.0.1 cicd-hello.local" | sudo tee -a /etc/hosts
```

### Make GHCR image public (one time)

After the first push, go to https://github.com/users/nguyentantin2105/packages/container/cicd-hello/settings
and set **Visibility = Public** so kind can pull without auth.

### Deploy via Helm

```bash
helm upgrade --install hello ./helm/cicd-hello

# Watch pods come up
kubectl get pods -w

# Open the site
open http://cicd-hello.local
```

### Update to a specific image tag

```bash
helm upgrade hello ./helm/cicd-hello \
  --set image.tag=sha-<short-sha>
```

### Tear down

```bash
helm uninstall hello
kind delete cluster --name cicd-hello
```

## Things to try (learning exercises)

- Break the test in `tests/script.test.js` and open a PR — watch CI fail.
- Add an ESLint rule and intentionally violate it — watch the lint step fail.
- Add a second workflow file that runs only on a schedule (`on: schedule`).
- Add a status badge to this README:
  `![CI/CD](https://github.com/<you>/cicd-hello/actions/workflows/ci-cd.yml/badge.svg)`
