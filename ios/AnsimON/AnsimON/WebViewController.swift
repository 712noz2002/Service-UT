import UIKit
import WebKit

final class WebViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate {
    private var webView: WKWebView!
    private var darkStatusIcons = false
    private var statusColor = UIColor(red: 0.0, green: 86.0 / 255.0, blue: 1.0, alpha: 1.0)

    private let nativeChromeJS = """
    (function(){
      if(window.__ansimNativeChrome)return;
      window.__ansimNativeChrome=true;
      function send(){
        var m=document.querySelector('meta[name="theme-color"]');
        var c=(m&&m.content)||'#ffffff';
        var dark=c.toLowerCase()!=='#0056ff';
        try{window.webkit.messageHandlers.nativeChrome.postMessage({color:c,darkIcons:dark});}catch(e){}
      }
      var m=document.querySelector('meta[name="theme-color"]');
      if(m)new MutationObserver(send).observe(m,{attributes:true,attributeFilter:['content']});
      window.addEventListener('hashchange',function(){setTimeout(send,0);});
      send();
    })();
    """

    override func loadView() {
        let controller = WKUserContentController()
        controller.add(self, name: "nativeChrome")
        controller.addUserScript(WKUserScript(
            source: nativeChromeJS,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: true
        ))

        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.userContentController = controller

        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.bounces = false
        webView.scrollView.showsVerticalScrollIndicator = false
        webView.scrollView.showsHorizontalScrollIndicator = false
        webView.isOpaque = true
        webView.backgroundColor = .white

        let root = UIView(frame: UIScreen.main.bounds)
        root.backgroundColor = statusColor
        root.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: root.safeAreaLayoutGuide.topAnchor),
            webView.leadingAnchor.constraint(equalTo: root.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: root.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: root.bottomAnchor)
        ])
        view = root
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        guard let indexURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") else {
            assertionFailure("www/index.html is missing from the app bundle")
            return
        }
        webView.loadFileURL(indexURL, allowingReadAccessTo: indexURL.deletingLastPathComponent())
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        if #available(iOS 13.0, *) {
            return darkStatusIcons ? .darkContent : .lightContent
        }
        return darkStatusIcons ? .default : .lightContent
    }

    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .bottom }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "nativeChrome",
              let payload = message.body as? [String: Any] else { return }

        let colorString = payload["color"] as? String ?? "#ffffff"
        let wantsDark = payload["darkIcons"] as? Bool ?? true

        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            self.statusColor = UIColor(hex: colorString) ?? .white
            self.darkStatusIcons = wantsDark
            self.view.backgroundColor = self.statusColor
            self.setNeedsStatusBarAppearanceUpdate()
            self.setNeedsUpdateOfHomeIndicatorAutoHidden()
        }
    }

    deinit {
        webView?.configuration.userContentController.removeScriptMessageHandler(forName: "nativeChrome")
    }
}

private extension UIColor {
    convenience init?(hex: String) {
        var s = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if s.hasPrefix("#") { s.removeFirst() }
        guard s.count == 6, let value = Int(s, radix: 16) else { return nil }
        let r = CGFloat((value >> 16) & 0xFF) / 255.0
        let g = CGFloat((value >> 8) & 0xFF) / 255.0
        let b = CGFloat(value & 0xFF) / 255.0
        self.init(red: r, green: g, blue: b, alpha: 1.0)
    }
}
