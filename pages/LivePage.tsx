
import React, { useState } from 'react';
import Section from '../components/Section';
import Icon from '../components/Icon';
import { MOCK_LIVE_STREAMS, THEME_COLORS } from '../constants';
import { LiveStream } from '../types';

const LiveStreamCard: React.FC<{ stream: LiveStream; onSelectStream: (stream: LiveStream) => void }> = ({ stream, onSelectStream }) => {
  return (
    <div 
        className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#8a2be2]/30 border border-[#2a2a2a] hover:border-[#8a2be2] transition-all duration-300 cursor-pointer group"
        onClick={() => onSelectStream(stream)}
    >
      <div className="h-40 w-full relative">
        <img src={stream.thumbnailUrl} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-md text-xs font-bold animate-pulse">LIVE</div>
        <div className="absolute bottom-2 right-2 bg-[rgba(0,0,0,0.7)] text-white px-2 py-0.5 rounded-md text-xs">{stream.viewers} viewers</div>
      </div>
      <div className="p-4">
        <h3 className="text-md font-semibold text-white mb-1 truncate group-hover:text-[#ff6b8b]">{stream.title}</h3>
        <p className="text-xs text-gray-400 mb-2">@{stream.creator}</p>
        <div className="flex flex-wrap gap-1">
            {stream.tags.slice(0,2).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-[#2a2a2a] text-gray-300 text-[10px] rounded-full">{tag}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

const MockChat: React.FC = () => (
    <div className="h-full bg-[#121212] border-l border-[#2a2a2a] p-4 flex flex-col">
        <h4 className="text-lg font-semibold text-white mb-3">Live Chat <span className="text-xs text-[#00c853]">(On-Chain Moderation)</span></h4>
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {[
                {user: 'Alice', msg: 'Great stream!', color: 'text-pink-400'},
                {user: 'Bob.eth', msg: 'Love this!', color: 'text-blue-400'},
                {user: 'CryptoFan', msg: 'Any alpha?', color: 'text-green-400'},
                {user: 'DAOQueen', msg: 'Tipping goal almost reached!', color: 'text-purple-400'},
            ].map((chat, i) => (
                <div key={i} className="text-xs">
                    <span className={`${chat.color} font-medium`}>{chat.user}: </span>
                    <span className="text-gray-300">{chat.msg}</span>
                </div>
            ))}
        </div>
        <div className="mt-4 flex gap-2">
            <input type="text" placeholder="Send a message (costs 0.001 GAS)" className="flex-1 bg-[#1e1e1e] border border-[#2a2a2a] px-3 py-2 rounded-md text-white text-xs focus:outline-none focus:border-[#8a2be2]" />
            <button className="bg-[#8a2be2] text-white px-3 py-2 rounded-md text-xs font-semibold hover:bg-[#6a0dad]">Send</button>
        </div>
    </div>
);


const LivePage: React.FC = () => {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(MOCK_LIVE_STREAMS[0] || null);

  return (
    <div className="text-white">
      {selectedStream && (
        <Section title={`Now Streaming: ${selectedStream.title}`} className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl overflow-hidden min-h-[60vh]">
            <div className="lg:col-span-2 p-1 sm:p-2 bg-[#121212]">
                {/* Main Player */}
                <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center mb-2 relative" style={{backgroundImage: `url(${selectedStream.thumbnailUrl})`, backgroundSize:'cover', backgroundPosition:'center'}}>
                    <Icon name="fas fa-play-circle" className="text-white text-7xl opacity-50"/>
                    {selectedStream.isMultiCam && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-[#8a2be2] to-[#ff6b8b] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            <Icon name="fas fa-video-slash" className="mr-1.5" /> Multi-Cam Available (Token Gated)
                        </span>
                    )}
                </div>
                 {/* Multi-cam options */}
                {selectedStream.isMultiCam && (
                    <div className="flex gap-1.5 overflow-x-auto p-1">
                        {[1,2,3,4].map(cam => (
                            <div key={cam} className="w-28 h-16 bg-black/70 rounded border-2 border-transparent hover:border-[#8a2be2] flex-shrink-0 cursor-pointer flex items-center justify-center text-gray-400 text-xs">Cam {cam}</div>
                        ))}
                    </div>
                )}
                <div className="p-2">
                     <h2 className="text-xl font-bold text-white mb-1">{selectedStream.title}</h2>
                     <p className="text-sm text-gray-400 mb-3">by <span className="text-[#ff6b8b]">{selectedStream.creator}</span> - {selectedStream.viewers} watching</p>
                     <div className="flex gap-3">
                        <button className="bg-[#8a2be2] text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2"><Icon name="fas fa-bell"/> Subscribe</button>
                        <button className="bg-[#00c853] text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2"><Icon name="fas fa-coins"/> Tip Creator</button>
                     </div>
                </div>
            </div>
            {/* Chat */}
            <div className="lg:col-span-1 h-[60vh] lg:h-auto">
                 <MockChat />
            </div>
          </div>
        </Section>
      )}

      <Section title="Explore Live Streams" viewAllLink="/live/all">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_LIVE_STREAMS.map(stream => (
            <LiveStreamCard key={stream.id} stream={stream} onSelectStream={setSelectedStream} />
          ))}
           {MOCK_LIVE_STREAMS.length === 0 && (
            <p className="col-span-full text-center text-gray-400 py-10">No live streams currently available.</p>
          )}
        </div>
      </Section>

      <Section title="Upcoming Premium Features">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
                <Icon name="fas fa-users-cog" className="text-3xl text-[#8a2be2] mb-3"/>
                <h4 className="text-lg font-semibold mb-2">DAO-Controlled Camera Angles</h4>
                <p className="text-sm text-gray-400">Token holders vote on preferred camera views during streams.</p>
            </div>
             <div className="p-6 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
                <Icon name="fas fa-hand-holding-usd" className="text-3xl text-[#00c853] mb-3"/>
                <h4 className="text-lg font-semibold mb-2">Collective Tipping Goals</h4>
                <p className="text-sm text-gray-400">Unlock special stream events or content when community tipping milestones are met.</p>
            </div>
             <div className="p-6 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
                <Icon name="fas fa-chart-line" className="text-3xl text-[#ff6b8b] mb-3"/>
                <h4 className="text-lg font-semibold mb-2">Subscriber Prediction Markets</h4>
                <p className="text-sm text-gray-400">Engage by predicting outcomes within live events using platform tokens.</p>
            </div>
        </div>
      </Section>
    </div>
  );
};

export default LivePage;
