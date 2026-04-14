import { useState, useRef } from "react"

const WEBHOOK_BASE = "https://oops01.zeabur.app/webhook"

const PLATFORMS = [
  { id: "threads", name: "Threads", subtitle: "文字優先的社群平台", bg: "#1C1C1C", border: "#3A3A3A", letter: "T", totalSteps: 2 },
  { id: "facebook", name: "Facebook", subtitle: "觸及最廣的社群媒體", bg: "#1877F2", border: "#1877F2", letter: "f", totalSteps: 3, imageRequired: false },
  { id: "instagram", name: "Instagram", subtitle: "視覺驅動的互動平台", bg: "#C13584", border: "#C13584", letter: "IG", totalSteps: 3, imageRequired: true }
]


function OptionCard({ selected, onClick, badge, title, sub }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 12px",
        background: selected ? "#1E1E1E" : "#131313",
        border: `1px solid ${selected ? "#4A4A4A" : "#222"}`,
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "center",
        transition: "border-color 0.15s, background 0.15s",
        userSelect: "none"
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: "700", color: selected ? "#FFF" : "#888", marginBottom: "3px" }}>{badge}</div>
      <div style={{ fontSize: "12px", color: selected ? "#CCC" : "#555" }}>{title}</div>
      {sub && <div style={{ fontSize: "10px", color: "#3A3A3A", marginTop: "2px" }}>{sub}</div>}
    </div>
  )
}

function ContentStep({ contentSrc, onSelect, customText, setCustomText, dbPreview, loadingDb }) {
  return (
    <div>
      <p style={{ fontSize: "11px", color: "#4A4A4A", marginTop: 0, marginBottom: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>文案來源</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        <OptionCard selected={contentSrc === "db"} onClick={() => onSelect("db")} badge="DB" title="資料庫文案" sub="AI 自動潤飾" />
        <OptionCard selected={contentSrc === "custom"} onClick={() => onSelect("custom")} badge="✍" title="自行輸入" sub="自由撰寫" />
      </div>

      {contentSrc === "db" && (
        loadingDb
          ? <div style={{ padding: "18px", background: "#111", border: "1px solid #1E1E1E", borderRadius: "8px", fontSize: "13px", color: "#555", textAlign: "center" }}>
              讀取資料庫中...
            </div>
          : <div style={{ padding: "14px", background: "#111", border: "1px solid #1E1E1E", borderRadius: "8px", fontSize: "13px", color: "#AAA", lineHeight: "1.7" }}>
              <div style={{ fontSize: "10px", color: "#3A3A3A", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>資料庫原始文案（發布時由 AI 潤飾）</div>
              {dbPreview || "（無資料）"}
            </div>
      )}

      {contentSrc === "custom" && (
        <textarea
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="請輸入貼文文案..."
          rows={5}
          style={{
            width: "100%", background: "#111", border: "1px solid #1E1E1E",
            borderRadius: "8px", color: "#CCC", padding: "12px", fontSize: "13px",
            lineHeight: "1.7", resize: "vertical", boxSizing: "border-box",
            outline: "none", fontFamily: "inherit"
          }}
        />
      )}
    </div>
  )
}

function ImageStep({ imgPreview, fileRef, onFileChange }) {
  return (
    <div>
      <p style={{ fontSize: "11px", color: "#4A4A4A", marginTop: 0, marginBottom: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>上傳圖片</p>
      <button onClick={() => fileRef.current?.click()} style={{
        width: "100%", padding: "20px", background: "#111",
        border: "1px dashed #333", borderRadius: "8px", color: "#555",
        fontSize: "13px", cursor: "pointer"
      }}>
        {imgPreview ? "✓ 圖片已選擇，點擊更換" : "點擊上傳圖片"}
      </button>
      {imgPreview && (
        <img src={imgPreview} alt="" style={{ width: "100%", maxHeight: "160px", objectFit: "cover", borderRadius: "8px", marginTop: "8px" }} />
      )}
    </div>
  )
}

function PreviewStep({ content, imgPreview, platform, generating }) {
  return (
    <div>
      <p style={{ fontSize: "11px", color: "#4A4A4A", marginTop: 0, marginBottom: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>貼文預覽</p>
      <div style={{ background: "#0E0E0E", border: "1px solid #1E1E1E", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderBottom: "1px solid #181818" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: platform.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "900", color: "#FFF" }}>
            O
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#EEE" }}>OOPS Official</div>
            <div style={{ fontSize: "11px", color: "#3A3A3A" }}>剛剛 · {platform.name}</div>
          </div>
        </div>
        {imgPreview && (
          <img src={imgPreview} alt="" style={{ width: "100%", maxHeight: "180px", objectFit: "cover" }} />
        )}
        <div style={{ padding: "14px", fontSize: "13px", color: generating ? "#444" : "#AAA", lineHeight: "1.7", whiteSpace: "pre-wrap", fontStyle: generating ? "italic" : "normal" }}>
          {generating ? "AI 生成中..." : (content || "（無文案）")}
        </div>
      </div>
    </div>
  )
}

function SuccessView({ platform, onClose, postLink }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (!postLink) return
    navigator.clipboard?.writeText(postLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }
  return (
    <div style={{ textAlign: "center", padding: "32px 16px" }}>
      <div style={{
        width: "52px", height: "52px", borderRadius: "50%",
        background: "#0F1F0F", border: "1px solid #1A3A1A",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px", fontSize: "20px", color: "#4CAF50"
      }}>✓</div>
      <div style={{ fontSize: "17px", fontWeight: "700", marginBottom: "6px", color: "#EEE" }}>發布成功！</div>
      <div style={{ fontSize: "13px", color: "#555", marginBottom: "20px" }}>已透過 n8n 發送至 {platform.name}</div>

      {postLink ? (
        <div style={{
          background: "#0C0C0C", border: "1px solid #1E1E1E",
          borderRadius: "10px", padding: "14px 16px", marginBottom: "20px", textAlign: "left"
        }}>
          <div style={{ fontSize: "10px", color: "#3A3A3A", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>貼文連結</div>
          <div style={{ fontSize: "12px", color: "#888", wordBreak: "break-all", lineHeight: "1.5", marginBottom: "12px", fontFamily: "monospace" }}>
            {postLink}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <a href={postLink} target="_blank" rel="noreferrer" style={{
              flex: 1, display: "block", padding: "8px",
              background: platform.bg, borderRadius: "7px",
              color: "#FFF", fontSize: "12px", fontWeight: "600",
              textDecoration: "none", textAlign: "center"
            }}>開啟貼文 →</a>
            <button onClick={copy} style={{
              padding: "8px 14px", background: copied ? "#1A2A1A" : "#1A1A1A",
              border: "1px solid #2A2A2A", borderRadius: "7px",
              color: copied ? "#4CAF50" : "#666", fontSize: "12px", cursor: "pointer"
            }}>{copied ? "已複製" : "複製"}</button>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: "11px", color: "#2A2A2A", marginBottom: "20px", fontFamily: "monospace" }}>
          {WEBHOOK_BASE}/{platform.id}-post
        </div>
      )}

      <button onClick={onClose} style={{
        background: "none", border: "1px solid #2A2A2A", borderRadius: "8px",
        color: "#555", padding: "9px 28px", fontSize: "13px", cursor: "pointer"
      }}>關閉</button>
    </div>
  )
}

function PostingLoader({ platform }) {
  return (
    <>
      <style>{`
        @keyframes oops-spin { to { transform: rotate(360deg); } }
        @keyframes oops-pulse { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.6; transform:scale(0.95); } }
        @keyframes oops-fadein { from{ opacity:0; transform:translateY(8px); } to{ opacity:1; transform:translateY(0); } }
      `}</style>
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", minHeight: "100%",
        background: "#000", zIndex: 200, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-start", paddingTop: "100px",
        boxSizing: "border-box", animation: "oops-fadein 0.2s ease"
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "18px", background: platform.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: platform.letter.length > 1 ? "20px" : "32px",
          fontWeight: "900", color: "#FFF",
          animation: "oops-pulse 1.4s ease-in-out infinite",
          marginBottom: "36px"
        }}>
          {platform.letter}
        </div>
        <div style={{
          width: "28px", height: "28px",
          border: "2px solid #1A1A1A",
          borderTop: `2px solid ${platform.bg}`,
          borderRadius: "50%",
          animation: "oops-spin 0.75s linear infinite",
          marginBottom: "24px"
        }} />
        <div style={{ fontSize: "15px", fontWeight: "600", color: "#CCC", marginBottom: "8px" }}>
          正在發布至 {platform.name}...
        </div>
        <div style={{ fontSize: "12px", color: "#2E2E2E" }}>
          n8n Webhook 處理中，請稍候
        </div>
      </div>
    </>
  )
}

export default function App() {
  const [modal, setModal] = useState(null)
  const [step, setStep] = useState(1)
  const [contentSrc, setContentSrc] = useState(null)
  const [customText, setCustomText] = useState("")
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [dbPreview, setDbPreview] = useState("")
  const [loadingDb, setLoadingDb] = useState(false)
  const [aiContent, setAiContent] = useState("")
  const [generating, setGenerating] = useState(false)
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState(false)
  const [postError, setPostError] = useState(null)
  const [postLink, setPostLink] = useState(null)
  const fileRef = useRef(null)

  const platform = PLATFORMS.find(p => p.id === modal)
  const totalSteps = platform?.totalSteps ?? 2
  const isLastStep = step === totalSteps

  const openModal = (id) => {
    setModal(id); setStep(1); setContentSrc(null); setCustomText("")
    setImgFile(null); setImgPreview(null)
    setDbPreview(""); setLoadingDb(false)
    setAiContent(""); setGenerating(false)
    setPosting(false); setPosted(false); setPostError(null); setPostLink(null)
  }

  const generateAiContent = async () => {
    setGenerating(true)
    setAiContent("")
    const platName = PLATFORMS.find(p => p.id === modal)?.name ?? ""
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 500,
          messages: [
            {
              role: "system",
              content: `你是 OOPS 品牌社群文案師。針對 ${platName} 平台，將以下資料庫文案改寫成吸引人的貼文，加入 emoji 和 hashtag，繁體中文約 100 字。只輸出文案。`
            },
            { role: "user", content: dbPreview }
          ]
        })
      })
      const data = await res.json()
      setAiContent(data.choices?.[0]?.message?.content ?? dbPreview)
    } catch {
      setAiContent(dbPreview)
    }
    setGenerating(false)
  }

  const selectContentSrc = async (src) => {
    setContentSrc(src)
    if (src !== "db") return
    setLoadingDb(true)
    try {
      const res = await fetch("https://oops01.zeabur.app/webhook/get-content")
      const data = await res.json()
      setDbPreview(data.content ?? "（無資料）")
    } catch {
      setDbPreview("無法讀取資料庫，請稍後再試")
    }
    setLoadingDb(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImgFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImgPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handlePost = async () => {
    setPosting(true)
    setPostError(null)
    let link = null
    try {
      let imageBase64 = null
      let imageMimeType = null
      if (imgFile) {
        imageMimeType = imgFile.type
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result.split(",")[1])
          reader.onerror = reject
          reader.readAsDataURL(imgFile)
        })
      }

      const res = await fetch(`${WEBHOOK_BASE}/${modal}-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: modal,
          content: contentSrc === "db" ? aiContent : customText,
          contentSrc,
          imageOption: "upload",
          imageBase64,
          imageMimeType,
          timestamp: new Date().toISOString()
        })
      })

      if (!res.ok) {
        throw new Error(`伺服器回傳錯誤（${res.status}），請檢查 n8n 流程是否正常運作`)
      }

      const data = await res.json()
      if (data.error) {
        throw new Error(`n8n 發生錯誤：${data.error}`)
      }
      link = data.url ?? data.link ?? data.postUrl ?? data.permalink ?? data.post_url ?? null
    } catch (err) {
      setPostError(err.message ?? "發布失敗，請稍後再試")
      setPosting(false)
      return
    }
    setPostLink(link)
    setPosting(false)
    setPosted(true)
  }

  const canNext = () => {
    if (step === 1) {
      if (!contentSrc) return false
      if (contentSrc === "custom") return customText.trim().length > 0
      return true
    }
    if (step === 2 && modal !== "threads") {
      return !!imgFile
    }
    return true
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0A", color: "#FFF",
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      position: "relative"
    }}>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "72px 24px 56px", borderBottom: "1px solid #161616" }}>
        <div style={{
          fontSize: "88px", fontWeight: "900", letterSpacing: "-5px",
          lineHeight: 1, color: "#FFF", display: "inline-block"
        }}>
          OOPS
        </div>
        <div style={{ marginTop: "16px", fontSize: "10px", letterSpacing: "4px", color: "#363636", textTransform: "uppercase" }}>
          Social Intelligence Platform
        </div>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#303030" }}>
          選擇平台 · 生成文案 · 一鍵發布
        </div>
      </div>

      {/* PLATFORM CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {PLATFORMS.map((p, i) => (
          <div key={p.id} style={{
            padding: "44px 32px",
            borderRight: i < 2 ? "1px solid #161616" : "none",
            borderBottom: "1px solid #161616",
            display: "flex", flexDirection: "column", gap: "16px"
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "11px",
              background: p.bg, border: `1px solid ${p.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: p.letter.length > 1 ? "11px" : "18px",
              fontWeight: "900", color: "#FFF", letterSpacing: "-0.5px"
            }}>
              {p.letter}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "6px" }}>{p.name}</div>
              <div style={{ fontSize: "12px", color: "#444", lineHeight: 1.5 }}>{p.subtitle}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => openModal(p.id)}
                style={{
                  padding: "10px 20px", background: p.bg, color: "#FFF",
                  border: "none", borderRadius: "8px", fontSize: "13px",
                  fontWeight: "600", cursor: "pointer", letterSpacing: "0.3px"
                }}
              >
                立即發文 →
              </button>
              <span style={{ fontSize: "11px", color: "#2A2A2A" }}>
                {p.totalSteps} 步完成
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{ padding: "28px 24px", borderTop: "1px solid #161616", textAlign: "center" }}>
        <div style={{ fontSize: "10px", color: "#2A2A2A", letterSpacing: "2px", textTransform: "uppercase" }}>
          Powered by n8n × Claude AI — OOPS Platform
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {modal && platform && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", minHeight: "100%",
          background: "rgba(0,0,0,0.94)",
          zIndex: 100, display: "flex", justifyContent: "center",
          alignItems: "flex-start", padding: "48px 24px", boxSizing: "border-box"
        }}>
          {posting && <PostingLoader platform={platform} />}

          <div style={{
            background: "#111", border: "1px solid #222",
            borderRadius: "14px", width: "100%", maxWidth: "460px",
            overflow: "hidden"
          }}>

            {/* Modal Header */}
            <div style={{
              padding: "18px 20px", borderBottom: "1px solid #1A1A1A",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "26px", height: "26px", borderRadius: "6px",
                  background: platform.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: platform.letter.length > 1 ? "8px" : "12px",
                  fontWeight: "900", color: "#FFF"
                }}>
                  {platform.letter}
                </div>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#DDD" }}>
                  {platform.name} 發文
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} style={{
                      width: "5px", height: "5px", borderRadius: "50%",
                      background: i < step ? "#FFF" : "#2A2A2A",
                      transition: "background 0.2s"
                    }} />
                  ))}
                </div>
                {!posted && (
                  <button onClick={() => setModal(null)} style={{
                    background: "none", border: "none", color: "#444",
                    fontSize: "20px", cursor: "pointer", lineHeight: 1, padding: 0
                  }}>×</button>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "22px 20px" }}>
              {posted ? (
                <SuccessView platform={platform} onClose={() => setModal(null)} postLink={postLink} />
              ) : step === 1 ? (
                <ContentStep
                  contentSrc={contentSrc} onSelect={selectContentSrc}
                  customText={customText} setCustomText={setCustomText}
                  dbPreview={dbPreview} loadingDb={loadingDb}
                />
              ) : step === 2 && modal !== "threads" ? (
                <ImageStep
                  imgPreview={imgPreview} fileRef={fileRef} onFileChange={handleFileChange}
                />
              ) : (
                <PreviewStep
                  content={contentSrc === "db" ? aiContent : customText}
                  imgPreview={imgPreview}
                  platform={platform}
                  generating={generating}
                />
              )}
            </div>

            {/* Modal Footer */}
            {!posted && (
              <div style={{ borderTop: "1px solid #1A1A1A" }}>
                {postError && (
                  <div style={{ padding: "10px 20px", background: "#1A0A0A", fontSize: "12px", color: "#E05555", lineHeight: "1.5" }}>
                    ⚠ {postError}
                  </div>
                )}
              <div style={{
                padding: "14px 20px",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <button
                  onClick={() => step > 1 ? setStep(s => s - 1) : setModal(null)}
                  style={{
                    background: "none", border: "1px solid #222", borderRadius: "8px",
                    color: "#555", padding: "8px 16px", fontSize: "12px", cursor: "pointer"
                  }}
                >
                  {step === 1 ? "取消" : "← 返回"}
                </button>

                {!isLastStep ? (
                  <button
                    onClick={() => {
                      setStep(s => s + 1)
                      if (step === totalSteps - 1 && contentSrc === "db") generateAiContent()
                    }}
                    disabled={!canNext()}
                    style={{
                      background: canNext() ? platform.bg : "#1A1A1A",
                      border: "none", borderRadius: "8px",
                      color: canNext() ? "#FFF" : "#333",
                      padding: "8px 20px", fontSize: "12px", fontWeight: "600",
                      cursor: canNext() ? "pointer" : "not-allowed",
                      transition: "all 0.15s"
                    }}
                  >
                    下一步 →
                  </button>
                ) : posting ? (
                  <div style={{ fontSize: "12px", color: "#444" }}>發布中...</div>
                ) : postError ? (
                  <button
                    onClick={() => { setPostError(null); handlePost() }}
                    style={{
                      background: "#7A1A1A", border: "none", borderRadius: "8px",
                      color: "#FFF", padding: "8px 20px", fontSize: "12px",
                      fontWeight: "600", cursor: "pointer"
                    }}
                  >
                    重試 →
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    {contentSrc === "db" && (
                      <button
                        onClick={generateAiContent}
                        disabled={generating}
                        style={{
                          background: "none", border: "1px solid #333", borderRadius: "8px",
                          color: generating ? "#444" : "#888", padding: "8px 14px",
                          fontSize: "12px", cursor: generating ? "not-allowed" : "pointer"
                        }}
                      >
                        {generating ? "生成中..." : "重新生成"}
                      </button>
                    )}
                    <button
                      onClick={handlePost}
                      disabled={generating}
                      style={{
                        background: generating ? "#1A1A1A" : platform.bg,
                        border: "none", borderRadius: "8px",
                        color: generating ? "#333" : "#FFF",
                        padding: "8px 20px", fontSize: "12px",
                        fontWeight: "600", cursor: generating ? "not-allowed" : "pointer"
                      }}
                    >
                      立即發布 →
                    </button>
                  </div>
                )}
              </div>
              </div>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        </div>
      )}
    </div>
  )
}
